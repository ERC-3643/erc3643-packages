import OnchainID from '@onchain-id/solidity';
import { Contract, Signer } from 'ethers';
import { getClaimIssuer } from './claim-issuer';

export const getOnchainIDIdentity = (contractAddress: string, signer: Signer) => {

  const contract = new Contract(
    contractAddress,
    OnchainID.contracts.Identity.abi,
    signer
  );

  const getClaimIdsByTopic = (topic: string) => contract.getClaimIdsByTopic(topic)
  const getClaim = (claimId: string) => contract.getClaim(claimId)

  const getClaimsWithIssues = async (identityAddress: string, claimTopics: string[]) => {
    const missingClaimTopics = [];
    const invalidClaims = [];

    for (const topic of claimTopics) {
      const claimIds = await getClaimIdsByTopic(topic);

      !claimIds.length && missingClaimTopics.push(topic);

      for (const claimId of claimIds) {
        const claim = await getClaim(claimId);

        const {
          isClaimValid
        } = getClaimIssuer(claim.issuer, signer);

        const isValid = await isClaimValid(
          identityAddress,
          topic,
          claim.signature,
          claim.data
        );

        !isValid && invalidClaims.push(claim);
      }
    }

    return {
      missingClaimTopics,
      invalidClaims
    }
  }

  return {
    contract,
    getClaimIdsByTopic,
    getClaim,
    getClaimsWithIssues
  }
}
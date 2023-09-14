import { Signer, constants } from 'ethers';
import { getIdentityRegistry } from './identity-registry';
import { getClaimTopicsRegistry } from './claim-topics-registry';
import { getOnchainIDIdentity } from './onchain-id-identity';
import { getClaimIssuer } from './claim-issuer';

export const getEligibilityVerification = async (identityRegistryAddress: string, signer: Signer) => {
  const signerAddress = await signer.getAddress();

  const {
    isVerified,
    identity,
    topicsRegistry
  } = await getIdentityRegistry(identityRegistryAddress, signer);

  const identityIsVerified = await isVerified(signerAddress);

  const missingClaimTopics = [];
  const invalidClaims = [];

  if (!identityIsVerified) {
    const identityAddress = await identity(signerAddress);

    if (identityAddress === constants.AddressZero) {
      console.log(`There is no OnChainID associated with address ${signerAddress}`);
    } else {
      const topicsRegistryAddress = await topicsRegistry();

      const {
        getClaimTopics
      } = getClaimTopicsRegistry(
        topicsRegistryAddress,
        signer
      );

      const {
        getClaim,
        getClaimIdsByTopic
      } = getOnchainIDIdentity(identityAddress, signer);

      const claimTopics = await getClaimTopics();

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
    }
  }

  return {
    identityIsVerified,
    missingClaimTopics,
    invalidClaims
  }
}
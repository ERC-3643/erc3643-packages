import OnchainID from '@onchain-id/solidity';
import { Contract, Signer } from 'ethers';

export const getOnchainIDIdentity = (contractAddress: string, signer: Signer) => {

  const contract = new Contract(
    contractAddress,
    OnchainID.contracts.Identity.abi,
    signer
  );

  const getClaimIdsByTopic = (topic: string) => contract.getClaimIdsByTopic(topic)
  const getClaim = (claimId: string) => contract.getClaim(claimId)

  return {
    contract,
    getClaimIdsByTopic,
    getClaim
  }
}
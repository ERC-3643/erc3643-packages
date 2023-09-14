import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'

export const getClaimTopicsRegistry = (contractAddress: string, signer: Signer) => {

  const contract = new Contract(
    contractAddress,
    contracts.ClaimTopicsRegistry.abi,
    signer
  );

  const getClaimTopics = () => contract.getClaimTopics();
  return {
    contract,
    getClaimTopics
  }
}
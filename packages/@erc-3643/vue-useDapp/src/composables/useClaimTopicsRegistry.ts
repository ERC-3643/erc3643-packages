import { ClaimTopicsRegistryContract } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useClaimTopicsRegistry(contractAddress: string, signer: Signer) {
  return ClaimTopicsRegistryContract.init(contractAddress, signer);
}
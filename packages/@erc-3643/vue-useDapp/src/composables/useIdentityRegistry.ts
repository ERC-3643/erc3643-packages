import { IdentityRegistryContract } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useIdentityRegistry(contractAddress: string, signer: Signer) {
  return IdentityRegistryContract.init(contractAddress, signer)
}
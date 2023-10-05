import { OnchainIDIdentityContract } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useOnchainIDIdentity(contractAddress: string, signer: Signer) {
  return OnchainIDIdentityContract.init(contractAddress, signer);
}
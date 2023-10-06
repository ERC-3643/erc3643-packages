import { ClaimIssuerContract } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useClaimIssuer(contractAddress: string, signer: Signer) {
  return ClaimIssuerContract.init(contractAddress, signer);
}
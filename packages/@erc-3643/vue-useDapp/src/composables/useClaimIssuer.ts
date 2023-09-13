import { getClaimIssuer } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useClaimIssuer(contractAddress: string, signer: Signer, debug = false) {
  const {
    contract,
    isClaimValid
  } = getClaimIssuer(contractAddress, signer);

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    isClaimValid
  }
}
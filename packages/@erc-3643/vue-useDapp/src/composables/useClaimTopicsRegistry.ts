import { getClaimTopicsRegistry } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useClaimTopicsRegistry(contractAddress: string, signer: Signer, debug = false) {
  const {
    contract,
    getClaimTopics
  } = getClaimTopicsRegistry(contractAddress, signer);

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    getClaimTopics
  }
}
import { getOnchainIDIdentity } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useOnchainIDIdentity(contractAddress: string, signer: Signer, debug = false) {
  const {
    contract,
    getClaim,
    getClaimIdsByTopic
  } = getOnchainIDIdentity(contractAddress, signer);

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    getClaim,
    getClaimIdsByTopic
  }
}
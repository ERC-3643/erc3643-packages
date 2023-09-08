import { getIdentityRegistry } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useIdentityRegistry(contractAddress: string, signer: Signer, debug = false) {
  const {
    contract,
    getInvestorCountry,
    isVerified,
    identity,
    topicsRegistry
  } = getIdentityRegistry(contractAddress, signer);

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    getInvestorCountry,
    isVerified,
    identity,
    topicsRegistry
  }
}
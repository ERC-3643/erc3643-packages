import { getCompliance } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useCompliance(contractAddress: string, signer: Signer, debug = false) {
  const {
    canTransfer,
    canTransferWithReasons,
    getModules,
    contract
  } = getCompliance(contractAddress, signer);

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    canTransfer,
    canTransferWithReasons,
    getModules
  };
}

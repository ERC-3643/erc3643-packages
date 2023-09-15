import { getComplianceModule } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useComplianceModule(
  contractAddress: string,
  abi: any[],
  signer: Signer,
  debug = false
) {
  const {
    moduleCheck,
    contract
  } = getComplianceModule(contractAddress, abi, signer);

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    moduleCheck
  };
}

import { ComplianceModuleContract } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useComplianceModule(
  contractAddress: string,
  abi: any[],
  signer: Signer
) {
  return ComplianceModuleContract.init(contractAddress, abi, signer);;
}

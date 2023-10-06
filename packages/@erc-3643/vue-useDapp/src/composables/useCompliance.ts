import { ComplianceContract } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export function useCompliance(contractAddress: string, signer: Signer) {
  return ComplianceContract.init(contractAddress, signer);
}

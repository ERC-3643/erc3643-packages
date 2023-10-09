import { getTransferCompliance } from '@erc-3643/core'

export const useTransferCompliance = () => {
  const {
    isTransferCompliant
  } = getTransferCompliance;

  return {
    isTransferCompliant
  };
};

import { getTransferCompliance } from '@erc-3643/core';

export function useTransferCompliance() {
  const {
    isTransferCompliant
  } = getTransferCompliance();

  return {
    isTransferCompliant
  };
}

import { getHolderEligibilityVerification } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export const useHolderEligibilityVerification = async (
  tokenAddress: string,
  walletAddress: string | null = null,
  signer: Signer
) => getHolderEligibilityVerification.verifyHolderEligibility(
  tokenAddress,
  walletAddress,
  signer
)

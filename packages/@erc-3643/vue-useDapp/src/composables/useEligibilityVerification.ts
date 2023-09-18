import { getEligibilityVerification } from '@erc-3643/core';
import { Signer } from 'vue-dapp';

export const useEligibilityVerification = async (
  identityRegistryAddress: string,
  signer: Signer,
  walletAddressToCheck: string | null = null
) => getEligibilityVerification(
    identityRegistryAddress,
    signer,
    walletAddressToCheck
  );

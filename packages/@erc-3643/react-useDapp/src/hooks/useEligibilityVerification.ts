import { getEligibilityVerification } from "@erc-3643/core";
import { Signer } from "ethers";

export const useEligibilityVerification = (signer: Signer | undefined) => {
  const getEligibility = async (
    identityRegistryAddress: string,
    walletAddressToCheck: string | null = null
  ): Promise<{
    missingClaimTopics: string[];
    invalidClaims: any[];
    identityIsVerified: boolean;
  } | null> => {
    if (!signer || !identityRegistryAddress || !walletAddressToCheck) {
      return null;
    }

    return getEligibilityVerification.getEligibilityVerification(
      identityRegistryAddress,
      signer,
      walletAddressToCheck
    );
  };

  return {
    getEligibilityVerification: getEligibility,
  };
};

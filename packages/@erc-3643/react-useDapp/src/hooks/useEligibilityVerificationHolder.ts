import { getHolderEligibilityVerification } from "@erc-3643/core";
import { providers, Signer } from "ethers";

export const useEligibilityVerificationHolder = ({
  signer,
}: {
  signer: Signer | providers.Web3Provider;
}) => {
  const { verifyHolderEligibility } = getHolderEligibilityVerification;

  return {
    verifyHolderEligibility: ({
      tokenAddress,
      walletAddress,
    }: {
      tokenAddress: string;
      walletAddress: string;
    }) => verifyHolderEligibility(tokenAddress, walletAddress, signer),
  };
};

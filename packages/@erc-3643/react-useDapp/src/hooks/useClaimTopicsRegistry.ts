import { Signer, Contract } from "ethers";
import { ClaimTopicsRegistryContract } from "@erc-3643/core";

export interface ClaimTopicsRegistry {
  contract: Contract;
  getClaimTopics: () => any;
}

export const useClaimTopicsRegistry = (
  signer: Signer | undefined,
  debug = false
) => {
  const getClaimTopics = (
    contractAddress: string
  ): ClaimTopicsRegistry | null => {
    if (!signer) {
      return null;
    }

    const { contract, getClaimTopics } = ClaimTopicsRegistryContract.init(
      contractAddress,
      signer
    );

    if (debug) {
      signer.provider?.on("debug", (data: any) => console.log(...data));
    }

    return {
      contract,
      getClaimTopics,
    };
  };

  return {
    getClaimTopicsRegistry: getClaimTopics,
  };
};

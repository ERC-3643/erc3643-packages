import { Signer } from "@ethersproject/abstract-signer";
import { getClaimTopicsRegistry } from "@erc-3643/core";

export const useClaimTopicsRegistry = (
  contractAddress: string,
  signer: Signer | undefined,
  debug = false
) => {
  if (!signer) {
    return null;
  }

  const { contract, getClaimTopics } = getClaimTopicsRegistry(
    contractAddress,
    signer
  );

  signer.provider?.on("debug", (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    contract,
    getClaimTopics,
  };
};

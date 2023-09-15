import { Signer } from "@ethersproject/abstract-signer";
import { getCompliance } from "@erc-3643/core";

export const useCompliance = (
  contractAddress: string,
  signer: Signer | undefined,
  debug = false
) => {
  if (!signer) {
    return null;
  }

  const { canTransfer, getModules, contract } = getCompliance(
    contractAddress,
    signer
  );

  if (debug) {
    signer.provider?.on("debug", (data: any) => console.log(...data));
  }

  return {
    contract,
    canTransfer,
    getModules,
  };
};

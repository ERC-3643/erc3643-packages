import { Signer } from "@ethersproject/abstract-signer";
import { ClaimIssuerContract } from "@erc-3643/core";

export function useClaimIssuer(signer: Signer | undefined, debug = false) {
  const getIssuer = (contractAddress: string) => {
    if (!signer) {
      return null;
    }

    const { contract, isClaimValid } = ClaimIssuerContract.init(contractAddress, signer);

    if (debug) {
      signer.provider?.on("debug", (data: any) => console.log(...data));
    }

    return { contract, isClaimValid };
  };

  return {
    getClaimIssuer: getIssuer,
  };
}

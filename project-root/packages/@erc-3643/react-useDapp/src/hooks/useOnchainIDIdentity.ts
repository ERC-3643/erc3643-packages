import { Signer } from "@ethersproject/abstract-signer";
import { getOnchainIDIdentity } from "@erc-3643/core";

export function useOnchainIDIdentity(
  contractAddress: string,
  signer: Signer | undefined,
  debug = false
) {
  if (!signer) {
    return null;
  }

  const { contract, getClaim, getClaimIdsByTopic } = getOnchainIDIdentity(
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
    getClaim,
    getClaimIdsByTopic,
  };
}

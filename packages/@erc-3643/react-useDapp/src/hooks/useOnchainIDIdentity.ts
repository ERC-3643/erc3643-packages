import { Signer, Contract } from "ethers";
import { OnchainIDIdentityContract } from "@erc-3643/core";

export interface OnchainIDIdentity {
  contract: Contract;
  getClaimIdsByTopic: (topic: string) => any;
  getClaim: (claimId: string) => any;
}

export const useOnchainIDIdentity = (
  signer: Signer | undefined,
  debug = false
) => {
  const getOnchainIdentity = (
    contractAddress: string
  ): OnchainIDIdentity | null => {
    if (!signer) {
      return null;
    }

    const { contract, getClaim, getClaimIdsByTopic } = OnchainIDIdentityContract.init(
      contractAddress,
      signer
    );

    if (debug) {
      signer.provider?.on("debug", (data: any) => console.log(...data));
    }

    return {
      contract,
      getClaim,
      getClaimIdsByTopic,
    };
  };

  return {
    getOnchainIDIdentity: getOnchainIdentity,
  };
};

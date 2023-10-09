import { IdentityRegistryContract } from "@erc-3643/core";
import { Contract, Signer } from "ethers";

export interface IdentityRegistry {
  topicsRegistry: () => any;
  getInvestorCountry: (addressToCheck: string) => any;
  isVerified: (addressToCheck: string) => any;
  identity: (addressToCheck: string) => any;
  contract: Contract;
}

export const useIdentityRegistry = (
  signer: Signer | undefined,
  debug = false
) => {
  const getIdRegistry = (contractAddress: string): IdentityRegistry | null => {
    if (!signer || !contractAddress) {
      return null;
    }

    const {
      contract,
      getInvestorCountry,
      isVerified,
      identity,
      topicsRegistry,
    } = IdentityRegistryContract.init(contractAddress, signer as Signer);

    if (debug) {
      signer.provider?.on("debug", (data: any) => console.log(...data));
    }

    return {
      contract,
      getInvestorCountry,
      isVerified,
      identity,
      topicsRegistry,
    };
  };

  return {
    getIdentityRegistry: getIdRegistry,
  };
};

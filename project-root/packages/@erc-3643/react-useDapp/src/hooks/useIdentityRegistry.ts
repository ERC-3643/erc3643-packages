import { getIdentityRegistry } from "@erc-3643/core";
import { Contract, Signer } from "ethers";

export interface IdentityRegistry {
  topicsRegistry: () => any;
  getInvestorCountry: (addressToCheck: string) => any;
  isVerified: (addressToCheck: string) => any;
  identity: (addressToCheck: string) => any;
  contract: Contract;
}

export const useIdentityRegistry = (signer: Signer | undefined) => {
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
    } = getIdentityRegistry(contractAddress, signer as Signer);

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

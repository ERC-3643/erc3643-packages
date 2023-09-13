import { getIdentityRegistry } from "@erc-3643/core";
import { Signer } from "@ethersproject/abstract-signer";

export const useIdentityRegistry = (
  contractAddress: string,
  signer: Signer | undefined
) => {
  if (!contractAddress) {
    return null;
  }

  const { contract, getInvestorCountry, isVerified, identity, topicsRegistry } =
    getIdentityRegistry(contractAddress, signer as Signer);

  return {
    contract,
    getInvestorCountry,
    isVerified,
    identity,
    topicsRegistry,
  };
};

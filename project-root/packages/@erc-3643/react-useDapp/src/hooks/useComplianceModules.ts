import { Signer } from "@ethersproject/abstract-signer";
import { getComplianceModule } from "@erc-3643/core";

export const useComplianceModules = (
  contractAddresses: string[],
  abi: any[],
  signer: Signer,
  debug = false
) => {
  const modules = contractAddresses.map((contractAddress) => {
    const { moduleCheck, contract } = getComplianceModule(
      contractAddress,
      abi,
      signer
    );

    return { contractAddress, moduleCheck, contract };
  });

  if (debug) {
    signer.provider?.on("debug", (data: any) => console.log(...data));
  }

  return modules;
};

import { Contract, ContractInterface, Signer } from 'ethers'

export const getComplianceModule = (
  contractAddress: string,
  abi: ContractInterface,
  signer: Signer
) => {

  const contract = new Contract(
    contractAddress,
    abi,
    signer
  );

  const moduleCheck = (
    from: string,
    to: string,
    amount: number,
    complienceAddress: string
  ) => contract
    .moduleCheck(
      from,
      to,
      amount,
      complienceAddress
    );

  return {
    contract,
    moduleCheck
  }
}
import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'

export const getCompliance = (contractAddress: string, signer: Signer) => {
  const contract = new Contract(
    contractAddress,
    contracts.ModularCompliance.abi,
    signer
  );

  const canTransfer = (from: string, to: string, amount: number) => contract
    .canTransfer(from, to, amount);

  const getModules = () => contract.getModules();

  return {
    canTransfer,
    getModules,
    contract
  }
}
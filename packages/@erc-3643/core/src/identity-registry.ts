import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'

export const getIdentityRegistry = (contractAddress: string, signer: Signer) => {

  const contract = new Contract(
    contractAddress,
    contracts.IdentityRegistry.abi,
    signer
  );

  const getInvestorCountry = (addressToCheck: string) => contract.investorCountry(addressToCheck)

  return {
    contract,
    getInvestorCountry
  }
}
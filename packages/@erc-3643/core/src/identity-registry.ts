import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'

export const getIdentityRegistry = (contractAddress: string, signer: Signer) => {

  const contract = new Contract(
    contractAddress,
    contracts.IdentityRegistry.abi,
    signer
  );

  const getInvestorCountry = (addressToCheck: string) => contract.investorCountry(addressToCheck);

  const isVerified = (addressToCheck: string) => contract.isVerified(addressToCheck);

  const identity = (addressToCheck: string) => contract.identity(addressToCheck);

  const topicsRegistry = () => contract.topicsRegistry();

  return {
    contract,
    getInvestorCountry,
    isVerified,
    identity,
    topicsRegistry
  }
}
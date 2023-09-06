import { Contract } from 'ethers';
import { contracts } from '@tokenysolutions/t-rex';
import OnchainID from '@onchain-id/solidity';

const TOKEN_PROXY = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE';
const COMPLIANCE_BETA = '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getTokenContract = (signer: any) => new Contract(TOKEN_PROXY, contracts.Token.abi, signer);

export const getIdentityContract = (identityAddress: string, signer: any) =>
  new Contract(identityAddress, OnchainID.contracts.Identity.abi, signer);

export const getIdentityRegistryContract = async (tokenContract: any, signer: any) => {
  const identityRegistryContractAddress = await tokenContract.identityRegistry();

  return new Contract(
    identityRegistryContractAddress,
    contracts.IdentityRegistry.abi,
    signer
  );
}

export const getClaimTopicsRegistryContract = async (identityRegistryContract: any, signer: any) => {
  const topicsRegistryAddr = await identityRegistryContract.topicsRegistry();

  return new Contract(
    topicsRegistryAddr,
    contracts.ClaimTopicsRegistry.abi,
    signer
  );
}

export const getOnChainIdAddressByWalletAddress = async (identityRegistryContract: any, walletAddress: string) =>
  await identityRegistryContract.identity(walletAddress);

export const getClaimIssuerContract = (claimIssuerContractAddress: string, claimIssuerWallet: any) => new Contract(
  claimIssuerContractAddress,
  OnchainID.contracts.ClaimIssuer.abi,
  claimIssuerWallet
);

export const getComplianceBetaContract = (signer: any) => new Contract(
  COMPLIANCE_BETA,
  contracts.ModularCompliance.abi,
  signer
);

export const getCountryAllowComplianceModuleContract = (moduleAddress: string, signer: any) => new Contract(
  moduleAddress,
  contracts.CountryAllowModule.abi,
  signer
);

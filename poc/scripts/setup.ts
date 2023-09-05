import { Contract } from 'ethers';
import { contracts } from '@tokenysolutions/t-rex';
import OnchainID from '@onchain-id/solidity';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getTokenContract = (
  tokenProxyAddress: string,
  signer: any
) => new Contract(tokenProxyAddress, contracts.Token.abi, signer);

export const getIdentityContract = (
  identityAddress: string,
  signer: any
) => new Contract(identityAddress, OnchainID.contracts.Identity.abi, signer);

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

export const getOnChainIdAddressByWalletAddress = async (
  identityRegistryContract: any,
  walletAddress: string
) => {
  return await identityRegistryContract.identity(walletAddress);
}

export const getClaimIssuerContract = (claimIssuerContractAddress: string, claimIssuerWallet: any) => new Contract(
  claimIssuerContractAddress,
  OnchainID.contracts.ClaimIssuer.abi,
  claimIssuerWallet
);

import {
  getClaimTopicsRegistryContract,
  getIdentityContract,
  getOnChainIdAddressByWalletAddress,
  ZERO_ADDRESS
} from './setup';

export const getClaim = async (
  identityRegistryContract: any,
  identityWallet: any,
  deployerWallet: any
): Promise<{ claim: any; claimId: any; }> => {
  const onChainIdContractAddress = await getOnChainIdAddressByWalletAddress(
    identityRegistryContract,
    identityWallet.address
  );

  if (onChainIdContractAddress === ZERO_ADDRESS) {
    console.log(`There is no OnChainID associated with address ${identityWallet.address}`);

    return { claim: null, claimId: null};
  }

  const identityContract: any = getIdentityContract(onChainIdContractAddress, identityWallet);
  const claimTopicsRegistryContract = await getClaimTopicsRegistryContract(identityRegistryContract, deployerWallet);
  const claimTopics = await claimTopicsRegistryContract.getClaimTopics();
  const claimIds = await identityContract.getClaimIdsByTopic(claimTopics[0]);

  const claim = await identityContract.getClaim(claimIds[0]);

  return { claim, claimId: claimIds[0] };
}

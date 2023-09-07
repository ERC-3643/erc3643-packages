import { getIdentityContract, getOnChainIdAddressByWalletAddress } from './setup';

export const removeClaim = async (
  identityRegistryContract: any,
  claimHolderWallet: any,
  claimId: any
) => {
  console.log(`Removing claim with id ${claimId} ...`);

  const claimHolderIdentityContractAddress = await getOnChainIdAddressByWalletAddress(
    identityRegistryContract,
    claimHolderWallet.address
  );

  const claimHolderIdentityContract = getIdentityContract(claimHolderIdentityContractAddress, claimHolderWallet);

  const txRemoveClaim = await claimHolderIdentityContract.removeClaim(claimId);
  await txRemoveClaim.wait();

  console.log('Claim has been removed');
}

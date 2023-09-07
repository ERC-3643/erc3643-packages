import { getIdentityContract, getOnChainIdAddressByWalletAddress } from './setup';

export const addClaim = async (
  identityRegistryContract: any,
  claimHolderWallet: any,
  claim: any
) => {
  console.log(`Adding claim ...`);

  const claimHolderIdentityContractAddress = await getOnChainIdAddressByWalletAddress(
    identityRegistryContract,
    claimHolderWallet.address
  );

  const claimHolderIdentityContract = getIdentityContract(claimHolderIdentityContractAddress, claimHolderWallet);

  const txAddClaim = await claimHolderIdentityContract.addClaim(
    claim.topic,
    claim.scheme,
    claim.issuer,
    claim.signature,
    claim.data,
    claim.uri
  );
  await txAddClaim.wait();

  console.log('Claim has been added');
}

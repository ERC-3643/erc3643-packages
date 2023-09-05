export const registerCharlieIdentity = async (
  identityRegistryContract: any,
  identityWallet: any,
  countryCode: number = 42
) => {
  const isAlreadyRegistered = await identityRegistryContract.contains(identityWallet.address);

  if (isAlreadyRegistered) {
    console.log(`OnChainID is already registered for ${identityWallet.address}`);

    return;
  }

  // Where can we get this information?
  const onChainIdAddress = '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f'; // Charlies OnChainID address

  console.log(`Trying to register OnChainID for ${identityWallet.address}`);
  const tx = await identityRegistryContract.registerIdentity(identityWallet.address, onChainIdAddress, countryCode);

  await tx.wait();
  console.log(`Registered OnChainID for ${identityWallet.address}`);
}

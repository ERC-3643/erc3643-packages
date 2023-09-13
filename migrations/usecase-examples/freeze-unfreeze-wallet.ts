export const freezeUnfreezeWallet = async (tokenContract: any, wallet: any) => {
  console.log('\n', '=== Freezing wallet ===');

  let isFrozen = await tokenContract.isFrozen(wallet.address);
  console.log(`Is ${wallet.address} frozen?`, isFrozen);

  if (!isFrozen) {
    console.log(`Freezing ${wallet.address}`);
    const freezeWallet = await tokenContract.setAddressFrozen(wallet.address, true);
    await freezeWallet.wait();

    isFrozen = await tokenContract.isFrozen(wallet.address);
    console.log(`Is ${wallet.address} frozen?`, isFrozen);
  } else {
    console.log(`Unfreezing ${wallet.address}`);
    const unfreezeWallet = await tokenContract.setAddressFrozen(wallet.address, false);
    await unfreezeWallet.wait();

    isFrozen = await tokenContract.isFrozen(wallet.address);
    console.log(`Is ${wallet.address} frozen?`, isFrozen);
  }
}

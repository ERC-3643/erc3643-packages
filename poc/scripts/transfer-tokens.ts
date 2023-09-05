export const transferTokens = async (
  tokenContract: any,
  from: any,
  to: any
) => {
  console.log('\n', '=== Token transfers ===')

  const tokenAlice = tokenContract.connect(from);

  const bobWalletBalanceBefore = await tokenAlice.balanceOf(to.address);
  console.log('Bob\'s balance before the transfer', bobWalletBalanceBefore);

  console.log('Transferring 5 tokens aliceWallet -> bobWallet');
  const transfer = await tokenAlice.transfer(to.address, 5);
  await transfer.wait();

  const bobWalletBalanceAfter = await tokenAlice.balanceOf(to.address);
  console.log('Bob\'s balance after the transfer', bobWalletBalanceAfter);
}

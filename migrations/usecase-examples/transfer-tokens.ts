export const transferTokens = async (tokenContract: any, from: any, to: any) => {
  console.log('\n', '=== Token transfers ===')

  const tokenFrom = tokenContract.connect(from);

  const toWalletBalanceBefore = await tokenFrom.balanceOf(to.address);
  console.log('Receiver\'s balance before the transfer', toWalletBalanceBefore);

  console.log('Transferring 5 tokens from Sender to Receiver');
  const transfer = await tokenFrom.transfer(to.address, 5);
  await transfer.wait();

  const toWalletBalanceAfter = await tokenFrom.balanceOf(to.address);
  console.log('Receiver\'s balance after the transfer', toWalletBalanceAfter);
}

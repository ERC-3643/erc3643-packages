export const freezeTokens = async (tokenContract: any, wallet: any) => {
  console.log('\n', '=== Freezing tokens ===');

  console.log('Freezing 10 of Holder\'s tokens');
  const freezeTokens = await tokenContract.freezePartialTokens(wallet.address, 10);
  await freezeTokens.wait();

  const frozenTokens = await tokenContract.getFrozenTokens(wallet.address);

  const token = tokenContract.connect(wallet);
  const balance = await token.balanceOf(wallet.address);
  console.log('Total Holder\'s balance with frozen tokens', balance);
  console.log('Real Holder\'s balance', balance - frozenTokens);
}

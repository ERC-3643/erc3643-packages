export const freezeTokens = async (
  tokenContract: any,
  wallet: any
) => {
  console.log('\n', '=== Freezing tokens ===');

  console.log('Freezing 10 of Bob\'s tokens');
  const freezeTokens = await tokenContract.freezePartialTokens(wallet.address, 10);
  await freezeTokens.wait();

  const frozenTokens = await tokenContract.getFrozenTokens(wallet.address);

  const token = tokenContract.connect(wallet);
  const balance = await token.balanceOf(wallet.address);
  console.log('Total Bob\'s balance with frozen tokens', balance);
  console.log('Real Bob\'s balance', balance - frozenTokens);
}

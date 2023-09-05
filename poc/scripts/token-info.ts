export const showTokenInfo = async (tokenContract: any) => {
  console.log('\n', '=== Token info ===');

  console.log('Token.owner', await tokenContract.owner());
  console.log('Token.name', await tokenContract.name());
  console.log('Token.totalSupply', await tokenContract.totalSupply());
  console.log('Token.decimals', await tokenContract.decimals());
}

export const showTokenInfo = async (tokenContract: any) => {
  console.log('\n', '=== Token info ===');

  console.log('Owner', await tokenContract.owner());
  console.log('Name', await tokenContract.name());
  console.log('Total supply', await tokenContract.totalSupply());
  console.log('Decimals', await tokenContract.decimals());
}

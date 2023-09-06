import { contracts } from '@tokenysolutions/t-rex';
import { Contract, Signer } from 'ethers';

export const getToken = async (tokenAddress: string, signer: Signer) => {
  const tokenContract = new Contract(
    tokenAddress,
    contracts.Token.abi
  );

  const token: any = tokenContract.connect(signer as Signer);

  const owner = await token.owner();
  const name = await token.name();
  const totalSupply = await token.totalSupply();
  const decimals = await token.decimals();
  const balanceOf = await token.balanceOf(signer.getAddress());
  const paused = await token.paused();
  const frozenTokens = await token.getFrozenTokens(signer.getAddress());
  const realBalanceOf = balanceOf - frozenTokens;
  const walletIsFrozen = await token.isFrozen(signer.getAddress());

  const unfreeze = async (address: string) => {
    console.log(address)
    const freezeWallet = await token.setAddressFrozen(address, false);
    await freezeWallet.wait();
  }

  const freeze = async (address: string) => {
    const unfreezeWallet = await token.setAddressFrozen(address, true);
    await unfreezeWallet.wait();
  }

  const pause = async () => {
    const pause = await token.pause();
    await pause.wait();
  }

  const run = async () => {
    const unpause = await token.unpause();
    await unpause.wait();
  }

  return {
    tokenOwner: owner,
    tokenName: name,
    tokenTotalSupply: totalSupply,
    tokenDecimals: decimals,
    tokenPaused: paused,
    tokenBalanceOf: balanceOf,
    tokenFrozenTokens: frozenTokens,
    tokenRealBalanceOf: realBalanceOf,
    tokenWalletIsFrozen: walletIsFrozen,
    tokenRun: run,
    tokenPause: pause,
    tokenFreeze: freeze,
    tokenUnfreeze: unfreeze,
    contract: token
  };
}
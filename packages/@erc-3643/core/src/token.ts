import { contracts } from '@tokenysolutions/t-rex';
import { Contract, Signer } from 'ethers';

export const getToken = async (contractAddress: string, signer: Signer) => {
  const token = new Contract(
    contractAddress,
    contracts.Token.abi,
    signer
  );

  const owner = await token.owner();
  const name = await token.name();
  const totalSupply = await token.totalSupply();
  const decimals = await token.decimals();
  const balanceOf = await token.balanceOf(signer.getAddress());
  const paused = await token.paused();
  const frozenTokens = await token.getFrozenTokens(signer.getAddress());
  const realBalanceOf = balanceOf - frozenTokens;
  const walletIsFrozen = await token.isFrozen(signer.getAddress());

  const identityRegistry = () => token.identityRegistry();
  const compliance = () => token.compliance();
  const isWalletFrozen = (walletAddress: string) => token.isFrozen(walletAddress);
  const getFrozenTokens = (walletAddress: string) => token.getFrozenTokens(walletAddress);
  const getBalance = (walletAddress: string) => token.balanceOf(walletAddress);

  const unfreeze = async (address: string) => {
    const freezeWallet = await token.setAddressFrozen(address, true);
    await freezeWallet.wait();
  }

  const freeze = async (address: string) => {
    const unfreezeWallet = await token.setAddressFrozen(address, false);
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

  const areTransferPartiesFrozen = async (from: string, to: string): Promise<void> => {
    const errors: string[] = [];

    const senderFrozen = await isWalletFrozen(from);
    senderFrozen && errors.push(`${from} is frozen`);

    const receiverFrozen = await isWalletFrozen(to);
    receiverFrozen && errors.push(`${to} is frozen`);

    if (errors.length) throw new Error('Wallet is frozen', { cause: errors });
  }

  const isEnoughSpendableBalance = async (from: string, amount: number): Promise<void> => {
    const errors: string[] = [];

    const frozenTokens = await getFrozenTokens(from);
    const balance = await getBalance(from);
    const spendableBalance = balance - frozenTokens;
    amount > spendableBalance && errors.push(`Insufficient balance. Current spendable balance is ${spendableBalance}`);

    if (errors.length) throw new Error('Insufficient balance', { cause: errors });
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
    identityRegistry,
    compliance,
    isWalletFrozen,
    getFrozenTokens,
    getBalance,
    areTransferPartiesFrozen,
    isEnoughSpendableBalance,
    contract: token
  };
}

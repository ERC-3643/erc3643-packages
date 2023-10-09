import { contracts } from '@tokenysolutions/t-rex';
import { BigNumber, Contract, Signer } from 'ethers';
import { Service } from 'typedi';
import { BaseContract } from './base-contract';

@Service()
export class Token {
  private _contract: Contract;
  private signer: Signer;

  constructor(
    private readonly baseContract: BaseContract
  ) {}

  public get contract() {
    return this._contract;
  }

  public owner = async (): Promise<string> => {
    return this._contract.owner();
  }

  public name = async () => {
    return this._contract.name();
  }

  public totalSupply = async () => {
    return this._contract.totalSupply();
  }

  public decimals = async () => {
    return this._contract.decimals();
  }

  public balanceOf = (walletAddress?: string): Promise<BigNumber> => {
    return this._contract.balanceOf(walletAddress || this.signer.getAddress());
  }

  public paused = (): Promise<boolean> => {
    return this._contract.paused();
  }

  public frozenTokens = (walletAddress?: string): Promise<BigNumber> => {
    return this._contract.getFrozenTokens(walletAddress || this.signer.getAddress());
  }

  public walletIsFrozen = (walletAddress?: string): Promise<boolean> => {
    return this._contract.isFrozen(walletAddress || this.signer.getAddress());
  }

  public realBalanceOf = async (walletAddress?: string): Promise<string> => {
    const balanceOf = await this.balanceOf(walletAddress);
    return balanceOf.sub(await this.frozenTokens(walletAddress)).toString()
  }

  public identityRegistry = async () => {
    return this._contract.identityRegistry()
  }

  public compliance = async () => {
    return this._contract.compliance()
  }

  public isWalletFrozen = async (walletAddress?: string) => {
    return this._contract.isFrozen(walletAddress || this.signer.getAddress());
  }

  public getFrozenTokens = async (walletAddress?: string) => {
    return this._contract.getFrozenTokens(walletAddress || this.signer.getAddress());
  }

  public getBalance = async (walletAddress?: string) => {
    return this._contract.balanceOf(walletAddress || this.signer.getAddress());
  }

  public unfreeze = async (address: string) => {
    const freezeWallet = await this._contract.setAddressFrozen(address, false);
    await freezeWallet.wait();
  }

  public freeze = async (address: string) => {
    const unfreezeWallet = await this._contract.setAddressFrozen(address, true);
    await unfreezeWallet.wait();
  }

  public pause = async () => {
    const pause = await this._contract.pause();
    await pause.wait();
  }

  public run = async () => {
    const unpause = await this._contract.unpause();
    await unpause.wait();
  }

  public areTransferPartiesFrozen = async (from: string, to: string): Promise<void> => {
    const errors: string[] = [];

    const senderFrozen = await this.isWalletFrozen(from);
    senderFrozen && errors.push(`${from} is frozen`);

    const receiverFrozen = await this.isWalletFrozen(to);
    receiverFrozen && errors.push(`${to} is frozen`);

    if (errors.length) throw new Error('Wallet is frozen', { cause: errors });
  }

  public isEnoughSpendableBalance = async (from: string, amount: number): Promise<void> => {
    const errors: string[] = [];

    const frozenTokens = await this.getFrozenTokens(from);
    const balance = await this.getBalance(from);
    const spendableBalance = balance - frozenTokens;
    amount > spendableBalance && errors.push(`Insufficient balance. Current spendable balance is ${spendableBalance}`);

    if (errors.length) throw new Error('Insufficient balance', { cause: errors });
  }

  public init = (
    contractAddress: string,
    signer?: Signer
  ) => {
    console.log(this.baseContract)
    this._contract = this.baseContract.connect(
      contractAddress,
      contracts.Token.abi,
      signer
    );

    this.signer = signer;

    return this;
  }
}

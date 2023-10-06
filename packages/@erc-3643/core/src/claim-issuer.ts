import { contracts, interfaces } from '@onchain-id/solidity';
import { Signer } from 'ethers';
import { Service } from 'typedi';
import { BaseContract } from './base-contract';

@Service()
export class ClaimIssuer {
  private _contract: typeof interfaces.IClaimIssuer;

  constructor(
    private readonly baseContract: BaseContract
  ) {}

  public get contract() {
    return this._contract;
  }

  public isClaimValid = async (
    onchainIdentityAddress: string,
    topic: string,
    signature: string,
    data: string
  ) => {
    return this._contract.isClaimValid(
      onchainIdentityAddress,
      topic,
      signature,
      data
    )
  }

  public init = (
    contractAddress: string,
    signer?: Signer
  ) => {

    this._contract = this.baseContract.connect(
      contractAddress,
      contracts.ClaimIssuer.abi,
      signer
    );

    return this;
  }
}

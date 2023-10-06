import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'
import { Service } from 'typedi';

import { BaseContract } from './base-contract';

@Service()
export class ClaimTopicsRegistry {
  private _contract: Contract;

  constructor(
    private readonly baseContract: BaseContract
  ) {}

  public get contract() {
    return this._contract;
  }

  public getClaimTopics = async () => {
    return this._contract.getClaimTopics();
  }

  public init = (
    contractAddress: string,
    signer?: Signer
  ) => {

    this._contract = this.baseContract.connect(
      contractAddress,
      contracts.ClaimTopicsRegistry.abi,
      signer
    );

    return this;
  }
}

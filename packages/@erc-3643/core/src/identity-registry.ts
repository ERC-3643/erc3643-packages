import { contracts } from '@tokenysolutions/t-rex';
import { Contract, Signer } from 'ethers';
import Container, { Service } from 'typedi';

import { BaseContract } from './base-contract';

@Service()
export class IdentityRegistry {
  private _contract: Contract;

  constructor(
    private readonly baseContract: BaseContract
  ) {}

  public get contract() {
    return this._contract;
  }

  public getInvestorCountry = (addressToCheck: string) => this._contract.investorCountry(addressToCheck);

  public isVerified = (addressToCheck: string) => this._contract.isVerified(addressToCheck);

  public identity = (addressToCheck: string) => this._contract.identity(addressToCheck);

  public topicsRegistry = () => this._contract.topicsRegistry();


  public init = (
    contractAddress: string,
    signer?: Signer
  ) => {

    this._contract = this.baseContract.connect(
      contractAddress,
      contracts.IdentityRegistry.abi,
      signer
    );

    return this;
  }
}

export const IdentityRegistryContract = Container.get(IdentityRegistry);

import { Contract, ContractInterface, Signer } from 'ethers'
import { Service } from 'typedi';
import { BaseContract } from './base-contract';

@Service()
export class ComplianceModule {
  private _contract: Contract;

  constructor(
    private readonly baseContract: BaseContract
  ) {}

  public get contract() {
    return this._contract;
  }

  public moduleCheck = (
    from: string,
    to: string,
    amount: number,
    complianceAddress: string
  ) => {
    return this._contract
      .moduleCheck(
        from,
        to,
        amount,
        complianceAddress
      );
  }

  public init = (
    contractAddress: string,
    abi: ContractInterface,
    signer?: Signer
  ) => {

    this._contract = this.baseContract.connect(
      contractAddress,
      abi,
      signer
    );

    return this;
  }
}

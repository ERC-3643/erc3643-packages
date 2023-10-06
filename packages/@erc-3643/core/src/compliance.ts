import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'
import { Service } from 'typedi';
import { BaseContract } from './base-contract';
import { ComplianceModule } from './compliance-module';


@Service()
export class Compliance {
  private _contract: Contract;
  private signer: Signer;

  constructor(
    private readonly baseContract: BaseContract,
    private readonly complianceModule: ComplianceModule
  ) {}

  public get contract() {
    return this._contract;
  }

  public canTransfer = async (from: string, to: string, amount: number) => {
    return this._contract
      .canTransfer(from, to, amount);
  }

  public getModules = async () => {
    return this._contract.getModules();
  }

  public canTransferWithReasons = async (
    from: string,
    to: string,
    amount: number
  ): Promise<void> => {
    const errors: string[] = [];

    const isCompliant = await this.canTransfer(from, to, amount);

    if (isCompliant) return;

    const modules = await this.getModules();

    for (const moduleAddress of modules) {
      const moduleContract = this.complianceModule.init(
        moduleAddress,
        contracts.AbstractModule.abi,
        this.signer
      );
      try {
        const isCompliantWithModule = await moduleContract.moduleCheck(from, to, amount, this._contract.addressAddress);

        !isCompliantWithModule && errors.push(`Transfer is not compliant with module at ${moduleAddress}`);
      } catch (e) {
        errors.push(`Transfer is not compliant with module at ${moduleAddress}`);
      }
    }

    if (errors.length) throw new Error('Transfer is not compliant', { cause: errors });
  }

  public init = (
    contractAddress: string,
    signer?: Signer
  ) => {

    this._contract = this.baseContract.connect(
      contractAddress,
      contracts.ModularCompliance.abi,
      signer
    );

    this.signer = signer;

    return this;
  }
}

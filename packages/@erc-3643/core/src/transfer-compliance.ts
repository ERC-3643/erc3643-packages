import { Signer, providers } from 'ethers';
import { Token } from './token';
import { Compliance } from './compliance';
import { EligibilityVerification } from './eligibility-verification';
import Container, { Service } from 'typedi';

@Service()
export class TransferCompliance {

  constructor(
    private readonly token: Token,
    private readonly complianceContract: Compliance,
    private readonly eligibilityVerification: EligibilityVerification
  ) {}

  isTransferCompliant = async (
    signerOrProvider: Signer | providers.Web3Provider,
    tokenAddress: string,
    from: string,
    to: string,
    amount: number
  ): Promise<{ result: boolean, errors: string[] }> => {
    const token = await this.token.init(tokenAddress, signerOrProvider as Signer);
    const identityRegistryAddress = await token.identityRegistry();
    const complianceContractAddress = await token.compliance();
    // const { canTransferWithReasons } = getCompliance(complianceContractAddress, signerOrProvider as Signer);
    const compliance = this.complianceContract.init(complianceContractAddress, signerOrProvider as Signer);

    // Sender & Receiver wallets must not be frozen
    const frozenErrors = await this.getExecutionErrorReasons(token.areTransferPartiesFrozen, from, to);

    // Sender's spendable balance must be >= amount
    const balanceErrors = await this.getExecutionErrorReasons(token.isEnoughSpendableBalance, from, amount);

    // Receiver's ID must be verified
    const eligibilityErrors = await this.getExecutionErrorReasons(
      this.eligibilityVerification.getReceiverEligibilityVerificationReasons,
      identityRegistryAddress,
      signerOrProvider as Signer,
      to
    );

    // Sender & Receiver must be compliant
    const complianceErrors = await this.getExecutionErrorReasons(compliance.canTransferWithReasons, from, to, amount);

    // All compliance errors
    const errors = [frozenErrors, balanceErrors, eligibilityErrors, complianceErrors].flat();

    return {
      result: errors.length === 0,
      errors
    };
  }

  getExecutionErrorReasons = async (func: Function, ...args: any[]): Promise<string[]> => {
    const errors: string[] = [];

    try {
      await func(...args);
    } catch (error) {
      if (Array.isArray((error as Error).cause)) {
        errors.push(((error as Error).cause as string[]).join());
      }
    }

    return errors;
  }

}

export const getTransferCompliance = Container.get(TransferCompliance);

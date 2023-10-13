import { Signer, providers } from 'ethers';
import { Token } from './token';
import { Compliance } from './compliance';
import { EligibilityVerification } from './eligibility-verification';
import { Service } from 'typedi';

@Service()
export class TransferCompliance {

  constructor(
    private readonly token: Token,
    private readonly complianceContract: Compliance,
    private readonly eligibilityVerification: EligibilityVerification
  ) {}

  public isTransferCompliant = async (
    signerOrProvider: Signer | providers.Web3Provider,
    tokenAddress: string,
    from: string,
    to: string,
    amount: number,
    // TODO: Remove default value after feedback, fix tests accordingly
    qualificationPlatform = 'https://devpro-qualification-testing.tokeny.com'
  ): Promise<{ result: boolean, errors: string[], qualificationPlatform: string }> => {

    const token = await this.token.init(tokenAddress, signerOrProvider as Signer);
    const identityRegistryAddress = await token.identityRegistry();
    const complianceContractAddress = await token.compliance();
    const compliance = this.complianceContract.init(complianceContractAddress, signerOrProvider as Signer);
    const errors = [];

    // Sender & Receiver wallets must not be frozen
    try {
      await token.areTransferPartiesFrozen(from, to);
    } catch (error) {
      if (Array.isArray((error as Error).cause)) {
        errors.push(((error as Error).cause as string[]).join());
      } else {
        errors.push(error.message);
      }
    }

    // Sender's spendable balance must be >= amount
    try {
      await token.isEnoughSpendableBalance(from, amount);
    } catch (error) {
      if (Array.isArray((error as Error).cause)) {
        errors.push(((error as Error).cause as string[]).join());
      } else {
        errors.push(error.message);
      }
    }

    // Receiver's ID must be verified
    try {
      await this.eligibilityVerification.getReceiverEligibilityVerificationReasons(
        identityRegistryAddress,
        signerOrProvider as Signer,
        to
      );
    } catch (error) {
      if (Array.isArray((error as Error).cause)) {
        errors.push(((error as Error).cause as string[]).join());
      } else {
        errors.push(error.message);
      }
    }

    // Sender & Receiver must be compliant
    try {
      await compliance.canTransferWithReasons(from, to, amount);
    } catch (error) {
      if (Array.isArray((error as Error).cause)) {
        errors.push(((error as Error).cause as string[]).join());
      } else {
        errors.push(error.message);
      }
    }

    return {
      result: errors.length === 0,
      errors: errors.flat(),
      qualificationPlatform
    };
  }
}

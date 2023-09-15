import { Signer, providers } from 'ethers';
import { getToken } from './token';
import { getCompliance } from './compliance';
import { getReceiverEligabilityVerificationReasons } from './eligibility-verification';

export const getTransferCompliance = () => {
  const isTransferCompliant = async (
    signerOrProvider: Signer | providers.Web3Provider,
    tokenAddress: string,
    from: string,
    to: string,
    amount: number
  ): Promise<{ result: boolean, errors: string[] }> => {
    const token = await getToken(tokenAddress, signerOrProvider as Signer);
    const identityRegistryAddress = await token.identityRegistry();
    const complianceContractAddress = await token.compliance();
    const { canTransferWithReasons } = getCompliance(complianceContractAddress, signerOrProvider as Signer);

    // Sender & Receiver wallets must not be frozen
    const frozenErrors = await getExecutionErrorReasons(token.areTransferPartiesFrozen, from, to);

    // Sender's spendable balance must be >= amount
    const balanceErrors = await getExecutionErrorReasons(token.isEnoughSpendableBalance, from, amount);

    // Receiver's ID must be verified
    const eligibilityErrors = await getExecutionErrorReasons(
      getReceiverEligabilityVerificationReasons,
      identityRegistryAddress,
      signerOrProvider as Signer,
      to
    );

    // Sender & Receiver must be compliant
    const complianceErrors = await getExecutionErrorReasons(canTransferWithReasons, from, to, amount);

    // All compliance errors
    const errors = [frozenErrors, balanceErrors, eligibilityErrors, complianceErrors].flat();

    return {
      result: errors.length === 0,
      errors
    };
  }

  const getExecutionErrorReasons = async (func: Function, ...args: any[]): Promise<string[]> => {
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

  return {
    isTransferCompliant
  };
}

import { contracts } from '@tokenysolutions/t-rex';
import OnchainID from '@onchain-id/solidity';
import { Contract, Signer, providers } from 'ethers';
import { ZERO_ADDRESS } from '@/constants';

export const getTransferCompliance = () => {
  const isTransferCompliant = async (
    signerOrProvider: Signer | providers.Web3Provider,
    tokenAddress: string,
    from: string,
    to: string,
    amount: number
  ): Promise<{ result: boolean, errors: string[] }> => {
    const token = new Contract(
      tokenAddress,
      contracts.Token.abi,
      signerOrProvider
    );

    // Sender & Receiver wallets must not be frozen
    const frozenErrors = await isFrozen(token, from, to);
  
    // Sender's spendable balance must be >= amount
    const balanceErrors = await isEnoughBalance(token, from, amount);
  
    // Receiver's ID must be verified
    const receiverVerificationErrors = await isReceiverVerified(signerOrProvider, token, to);
  
    // Sender & Receiver must be compliant
    const complianceErrors = await isCompliant(signerOrProvider, token, from, to, amount);
  
    // All compliance errors
    const errors = [frozenErrors, balanceErrors, receiverVerificationErrors, complianceErrors].flat();
  
    return {
      result: errors.length === 0,
      errors
    };
  }
  
  const isFrozen = async (token: any, from: string, to: string): Promise<string[]> => {
    const errors: string[] = [];
  
    const senderFrozen = await token.isFrozen(from);
    senderFrozen && errors.push(`${from} is frozen`);
  
    const receiverFrozen = await token.isFrozen(to);
    receiverFrozen && errors.push(`${to} is frozen`);
  
    return errors;
  }
  
  const isEnoughBalance = async (token: any, from: string, amount: number): Promise<string[]> => {
    const errors: string[] = [];

    const frozenTokens = await token.getFrozenTokens(from);
    const balance = await token.balanceOf(from);
    const spendableBalance = balance - frozenTokens;
    amount > spendableBalance && errors.push(`Insufficient balance. Current spendable balance is ${spendableBalance}`);

    return errors;
  }
  
  const isReceiverVerified = async (signerOrProvider: any, token: any, addr: string): Promise<string[]> => {
    const errors: string[] = [];
  
    const identityRegistryContractAddress = await token.identityRegistry();
    const identityRegistryContract = new Contract(
      identityRegistryContractAddress,
      contracts.IdentityRegistry.abi,
      signerOrProvider
    );
    const isVerified = await identityRegistryContract.isVerified(addr);

    if (isVerified) return [];
  
    // check OnChainID
    const onChainIdContractAddress = await identityRegistryContract.identity(addr);
    if (onChainIdContractAddress === ZERO_ADDRESS) {
      errors.push(`There is no OnChainID associated with ${addr}`);
  
      return errors;
    }
  
    // check required claim topics
  const missingClaimTopics: any[] = [];
  const invalidClaimTopics: any[] = [];
    const onChainIdContract = new Contract(onChainIdContractAddress, OnchainID.contracts.Identity.abi, signerOrProvider);

    const claimTopicsRegistryAddr = await identityRegistryContract.topicsRegistry();
    const claimTopicsRegistryContract = new Contract(claimTopicsRegistryAddr, contracts.ClaimTopicsRegistry.abi, signerOrProvider);
    const claimTopics = await claimTopicsRegistryContract.getClaimTopics();
  
    for (const topic of claimTopics) {
      const claimIds = await onChainIdContract.getClaimIdsByTopic(topic);
      !claimIds.length && missingClaimTopics.push(topic);
  
      for (const claimId of claimIds) {
        const claim = await onChainIdContract.getClaim(claimId);

        const claimIssuerContract: any = new Contract(
          claim.issuer,
          OnchainID.contracts.ClaimIssuer.abi
        );

        const isClaimValid = await claimIssuerContract.isClaimValid(
          onChainIdContractAddress,
          topic,
          claim.signature,
          claim.data
        );

        !isClaimValid && invalidClaimTopics.push(topic);
      }
    }
  
    missingClaimTopics.length && errors.push(`${addr} has missing claims with topics ${missingClaimTopics.join()}`);
    invalidClaimTopics.length && errors.push(`${addr} has invalid claims with topics ${invalidClaimTopics.join()}`);

    return errors;
  }
  
  const isCompliant = async (
    signerOrProvider: any,
    token: any,
    from: string,
    to: string,
    amount: number
  ): Promise<string[]> => {
    const errors: string[] = [];
    const complianceContractAddress = await token.compliance();
    const complianceContract = new Contract(complianceContractAddress, contracts.ModularCompliance.abi, signerOrProvider);

    const isCompliant = await complianceContract.canTransfer(from, to, amount);

    if (isCompliant) return [];

    const modules = await complianceContract.getModules();

    for (const moduleAddress of modules) {
      const moduleContract = new Contract(moduleAddress, contracts.AbstractModule.abi);
      try {
        const isCompliantWithModule = await moduleContract.moduleCheck(from, to, amount, complianceContractAddress);

        !isCompliantWithModule && errors.push(`Transfer is not compliant with module at ${moduleAddress}`);
      } catch (e) {
        errors.push(`Transfer is not compliant with module at ${moduleAddress}`);
      }    
    }

    return errors;
  }

  return {
    isTransferCompliant
  };
}

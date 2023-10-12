/*
1. Sender & Receiver wallets must not be frozen
2. Sender's spendable balance must be >= amount
3. Receiver's ID must be verified
4. Receiver must be compliant
*/

import { Contract, ZeroAddress } from 'ethers';
import { contracts } from '@tokenysolutions/t-rex';
import OnchainID from '@onchain-id/solidity';

const qualificationMsg = (qpLink = 'https://devpro-qualification-testing.tokeny.com') =>
  `To achieve qualification visit ${qpLink}`;

export const fullCanTransfer = async (
  providerOrSigner: any,
  tokenContract: any,
  from: string,
  to: string,
  amount: number
) => {
  // Sender & Receiver wallets must not be frozen
  const frozenErrors = await checkIfFrozen(tokenContract, from, to);

  // Sender's spendable balance must be >= amount
  const balanceErrors = await checkSpendableBalance(tokenContract, from, amount);

  // Receiver's ID must be verified
  const receiverVerificationErrors = await checkVerification(providerOrSigner, tokenContract, to);

  // Sender & Receiver must be compliant
  const complianceErrors = await checkCompliance(providerOrSigner, tokenContract, from, to, amount);

  const errors = [frozenErrors, balanceErrors, receiverVerificationErrors, complianceErrors].flat();

  errors.length && errors.push(qualificationMsg());

  return {
    result: errors.length === 0,
    errors
  };
}

const checkIfFrozen = async (tokenContract: any, from: string, to: string): Promise<string[]> => {
  const errors: string[] = [];

  const senderFrozen = await tokenContract.isFrozen(from);
  senderFrozen && errors.push('Sender wallet is frozen');

  const receiverFrozen = await tokenContract.isFrozen(to);
  receiverFrozen && errors.push('Receiver wallet is frozen');

  return errors;
}

const checkSpendableBalance = async (tokenContract: any, from: string, amount: number): Promise<string[]> => {
  const errors: string[] = [];

  const frozenTokens = await tokenContract.getFrozenTokens(from);
  const balance = await tokenContract.balanceOf(from);
  const tokenDecimals = await tokenContract.decimals();
  const spendableBalance = balance - frozenTokens;

  if (tokenDecimals) {
    const amountWithDecimals = BigInt(amount * 10 ** Number(tokenDecimals));
    amountWithDecimals > spendableBalance &&
      errors.push(
        `${from} has insufficient balance. Current spendable balance is ${Number(spendableBalance) / 10 ** Number(tokenDecimals)}`
      );
  } else {
    amount > spendableBalance &&
    errors.push(`${from} has insufficient balance. Current spendable balance is ${spendableBalance}`)
  }

  return errors;
}

const checkVerification = async (providerOrSigner: any, tokenContract: any, walletAddr: string): Promise<string[]> => {
  const errors: string[] = [];

  const identityRegistryContractAddress = await tokenContract.identityRegistry();
  const identityRegistryContract = new Contract(
    identityRegistryContractAddress,
    contracts.IdentityRegistry.abi,
    providerOrSigner
  );
  const isVerified = await identityRegistryContract.isVerified(walletAddr);

  if (isVerified) return [];

  // check OnChainID
  const onChainIdContractAddress = await identityRegistryContract.identity(walletAddr);
  if (onChainIdContractAddress === ZeroAddress) {
    errors.push(`There is no OnChainID associated with address ${walletAddr}`);

    return errors;
  }

  // check required claim topics
  const missingClaimTopics: any[] = [];
  const invalidClaimTopics: any[] = [];
  const onChainIdContract = new Contract(onChainIdContractAddress, OnchainID.contracts.Identity.abi, providerOrSigner);

  const claimTopicsRegistryAddr = await identityRegistryContract.topicsRegistry();
  const claimTopicsRegistryContract = new Contract(claimTopicsRegistryAddr, contracts.ClaimTopicsRegistry.abi, providerOrSigner);
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

  missingClaimTopics.length && errors.push(`You have missing claims with topics ${missingClaimTopics.join()}`);
  invalidClaimTopics.length && errors.push(`You have invalid claims with topics ${invalidClaimTopics.join()}`);

  return errors;
}

const checkCompliance = async (
  providerOrSigner: any,
  tokenContract: any,
  from: string,
  to: string,
  amount: number
): Promise<string[]> => {
  const errors: string[] = [];
  const complianceContractAddress = await tokenContract.compliance();
  const complianceContract = new Contract(complianceContractAddress, contracts.ModularCompliance.abi, providerOrSigner);
  const tokenDecimals = await tokenContract.decimals();

  let amountWithDecimals;

  if (tokenDecimals) {
    amountWithDecimals = BigInt(amount * 10 ** Number(tokenDecimals));
  } else {
    amountWithDecimals = BigInt(amount);
  }

  const isCompliant = await complianceContract.canTransfer(from, to, amountWithDecimals);

  if (isCompliant) return [];

  const modules = await complianceContract.getModules();

  for (const moduleAddress of modules) {
    const moduleContract = new Contract(moduleAddress, contracts.AbstractModule.abi);
    try {
      const isCompliantWithModule = await moduleContract.moduleCheck(from, to, amountWithDecimals, complianceContractAddress);

      !isCompliantWithModule && errors.push(`Transaction is not compliant with module at ${moduleAddress}`);
    } catch (e) {
      errors.push(`Transaction is not compliant with module at ${moduleAddress}`);
    }    
  }

  return errors;
}

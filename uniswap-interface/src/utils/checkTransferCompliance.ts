import OnchainID from '@onchain-id/solidity'
import { contracts } from '@tokenysolutions/t-rex'
import { Contract } from 'ethers/lib/ethers'

export const checkTransferCompliance = async (
  provider: any,
  tokenAddress: string,
  from: string,
  to: string,
  amount: number,
  qualificationPlatform = 'https://devpro-qualification-testing.tokeny.com'
) => {
  const token = await getToken(tokenAddress, provider)

  // Sender & Receiver wallets must not be frozen
  const frozenErrors = await getExecutionErrorReasons(token.areTransferPartiesFrozen, from, to)

  // Sender's spendable balance must be >= amount
  const balanceErrors = await getExecutionErrorReasons(token.isEnoughSpendableBalance, from, amount)

  // Receiver's ID must be verified
  const eligibilityErrors: any[] = await checkVerification(provider, token.contract, to)

  // Sender & Receiver must be compliant
  const complianceErrors: any[] = await checkCompliance(provider, token.contract, from, to, amount)

  // All compliance errors
  const errors = [frozenErrors, balanceErrors, eligibilityErrors, complianceErrors].flat()

  return {
    result: errors.length === 0,
    errors,
    qualificationPlatform,
  }
}

const getToken = async (contractAddress: string, provider: any) => {
  const token = new Contract(contractAddress, contracts.Token.abi, provider)

  const owner = await token.owner()
  const name = await token.name()
  const totalSupply = await token.totalSupply()
  const decimals = await token.decimals()
  const balanceOf = await token.balanceOf(provider.getSigner().getAddress())
  const paused = await token.paused()
  const frozenTokens = await token.getFrozenTokens(provider.getSigner().getAddress())
  const realBalanceOf = balanceOf - frozenTokens
  const walletIsFrozen = await token.isFrozen(provider.getSigner().getAddress())

  const identityRegistry = () => token.identityRegistry()
  const compliance = () => token.compliance()
  const isWalletFrozen = (walletAddress: string) => token.isFrozen(walletAddress)
  const getFrozenTokens = (walletAddress: string) => token.getFrozenTokens(walletAddress)
  const getBalance = (walletAddress: string) => token.balanceOf(walletAddress)

  const areTransferPartiesFrozen = async (from: string, to: string): Promise<void> => {
    const errors: string[] = []

    const senderFrozen = await isWalletFrozen(from)
    senderFrozen && errors.push(`${from} is frozen`)

    const receiverFrozen = await isWalletFrozen(to)
    receiverFrozen && errors.push(`${to} is frozen`)

    if (errors.length) throw new Error('Wallet is frozen', { cause: errors })
  }

  const isEnoughSpendableBalance = async (from: string, amount: number): Promise<void> => {
    const errors: string[] = []

    const frozenTokens = await getFrozenTokens(from)
    const balance = await getBalance(from)
    const spendableBalance = balance - frozenTokens
    amount > spendableBalance &&
      errors.push(`${from} has insufficient balance. Current spendable balance is ${spendableBalance}`)

    if (errors.length) throw new Error('Insufficient balance', { cause: errors })
  }

  return {
    tokenOwner: owner,
    tokenName: name,
    tokenTotalSupply: totalSupply,
    tokenDecimals: decimals,
    tokenPaused: paused,
    tokenBalanceOf: balanceOf,
    tokenFrozenTokens: frozenTokens,
    tokenRealBalanceOf: realBalanceOf,
    tokenWalletIsFrozen: walletIsFrozen,
    identityRegistry,
    compliance,
    isWalletFrozen,
    getFrozenTokens,
    getBalance,
    areTransferPartiesFrozen,
    isEnoughSpendableBalance,
    contract: token,
  }
}

const getExecutionErrorReasons = async (func: (...args: any[]) => Promise<void>, ...args: any[]): Promise<string[]> => {
  const errors: string[] = []

  try {
    await func(...args)
  } catch (error) {
    if (Array.isArray((error as Error).cause)) {
      errors.push(((error as Error).cause as string[]).join())
    }
  }

  return errors
}

const checkVerification = async (provider: any, tokenContract: any, walletAddr: string) => {
  const errors: string[] = []

  const identityRegistryContractAddress = await tokenContract.identityRegistry()
  const identityRegistryContract = new Contract(
    identityRegistryContractAddress,
    contracts.IdentityRegistry.abi,
    provider
  )
  const isVerified = await identityRegistryContract.isVerified(walletAddr)

  if (isVerified) return []

  // check OnChainID
  const onChainIdContractAddress = await identityRegistryContract.identity(walletAddr)
  if (onChainIdContractAddress === '0x0000000000000000000000000000000000000000') {
    errors.push(`There is no OnChainID associated with ${walletAddr}`)

    return errors
  }

  // check required claim topics
  const missingClaimTopics: any[] = []
  const invalidClaimTopics: any[] = []
  const onChainIdContract = new Contract(onChainIdContractAddress, OnchainID.contracts.Identity.abi, provider)

  const claimTopicsRegistryAddr = await identityRegistryContract.topicsRegistry()
  const claimTopicsRegistryContract = new Contract(claimTopicsRegistryAddr, contracts.ClaimTopicsRegistry.abi, provider)
  const claimTopics = await claimTopicsRegistryContract.getClaimTopics()

  for (const topic of claimTopics) {
    const claimIds = await onChainIdContract.getClaimIdsByTopic(topic)
    !claimIds.length && missingClaimTopics.push(topic)

    for (const claimId of claimIds) {
      const claim = await onChainIdContract.getClaim(claimId)

      const claimIssuerContract: any = new Contract(claim.issuer, OnchainID.contracts.ClaimIssuer.abi)

      const isClaimValid = await claimIssuerContract.isClaimValid(
        onChainIdContractAddress,
        topic,
        claim.signature,
        claim.data
      )

      !isClaimValid && invalidClaimTopics.push(topic)
    }
  }

  missingClaimTopics.length && errors.push(`${walletAddr} has missing claims with topics ${missingClaimTopics.join()}`)
  invalidClaimTopics.length && errors.push(`${walletAddr} has invalid claims with topics ${invalidClaimTopics.join()}`)

  return errors
}

const checkCompliance = async (provider: any, tokenContract: any, from: string, to: string, amount: number) => {
  const errors: string[] = []
  const complianceContractAddress = await tokenContract.compliance()
  const complianceContract = new Contract(complianceContractAddress, contracts.ModularCompliance.abi, provider)

  const decimals = await tokenContract.decimals()
  let updatedAmount = amount
  if (decimals) {
    updatedAmount = amount / 10 ** Number(decimals)
  }

  const isCompliant = await complianceContract.canTransfer(from, to, updatedAmount)

  if (isCompliant) return []

  const modules = await complianceContract.getModules()

  for (const moduleAddress of modules) {
    const moduleContract = new Contract(moduleAddress, contracts.AbstractModule.abi)
    try {
      const isCompliantWithModule = await moduleContract.moduleCheck(from, to, updatedAmount, complianceContractAddress)

      !isCompliantWithModule && errors.push(`Transaction is not compliant with module at ${moduleAddress}`)
    } catch (e) {
      errors.push(`Transaction is not compliant with module at ${moduleAddress}`)
    }
  }

  return errors
}

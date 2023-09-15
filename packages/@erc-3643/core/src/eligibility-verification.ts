import { Signer, constants, providers } from 'ethers';
import { getIdentityRegistry } from './identity-registry';
import { getClaimTopicsRegistry } from './claim-topics-registry';
import { getOnchainIDIdentity } from './onchain-id-identity';

export const getEligibilityVerification = async (
  identityRegistryAddress: string,
  signer: Signer,
  walletAddressToCheck: string | null = null
) => {
  const walletAddress = walletAddressToCheck || await signer.getAddress();

  const {
    isVerified,
    identity,
    topicsRegistry
  } = getIdentityRegistry(identityRegistryAddress, signer);

  const identityIsVerified = await isVerified(walletAddress);

  const identityAddress = await identity(walletAddress);

  if (identityAddress === constants.AddressZero) {
    throw new Error(`There is no OnChainID associated with address ${walletAddress}`);
  }

  // I'm commenting this out because the response of this method will never contain information
  // on invalid or missing claims as it throws an error before reading claims if the identity is not verified.

  // if (!identityIsVerified) {
  //   throw new Error(`Identity is not verified for address ${walletAddress}`);
  // }

  const topicsRegistryAddress = await topicsRegistry();

  const {
    getClaimTopics
  } = getClaimTopicsRegistry(
    topicsRegistryAddress,
    signer
  );

  const claimTopics = await getClaimTopics();

  const {
    getClaimsWithIssues
  } = getOnchainIDIdentity(identityAddress, signer);

  const claimsWithIssues = await getClaimsWithIssues(identityAddress, claimTopics);

  return {
    identityIsVerified,
    ...claimsWithIssues
  }
}

export const getReceiverEligabilityVerificationReasons = async (
  identityRegistryAddress: string,
  signerOrProvider: Signer | providers.Web3Provider,
  addr: string
): Promise<void> => {
  const errors: string[] = [];

  try {
    const { identityIsVerified, missingClaimTopics, invalidClaims } = await getEligibilityVerification(
      identityRegistryAddress,
      signerOrProvider as Signer,
      addr
    );

    if (identityIsVerified) return;

    missingClaimTopics.length && errors.push(`${addr} has missing claims with topics ${missingClaimTopics.join()}`);
    invalidClaims.length && errors.push(`${addr} has invalid claims with topics ${invalidClaims.map(claim => claim.topic).join()}`);
  } catch (error) {
    errors.push((error as Error).message);
  }

  // return errors;
  if (errors.length) throw new Error('Identity not eligible for transfer', { cause: errors });
}

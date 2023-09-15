import { Signer, constants } from 'ethers';
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
  } = await getIdentityRegistry(identityRegistryAddress, signer);

  const identityIsVerified = await isVerified(walletAddress);

  if (!identityIsVerified) {
    throw new Error(`Identity is not verified for address ${walletAddress}`);
  }

  const identityAddress = await identity(walletAddress);

  if (identityAddress === constants.AddressZero) {
    throw new Error(`There is no OnChainID associated with address ${walletAddress}`);
  }

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
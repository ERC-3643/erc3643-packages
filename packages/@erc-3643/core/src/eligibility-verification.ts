import { Signer, constants, providers } from 'ethers';
import { IdentityRegistry } from './identity-registry';
import { ClaimTopicsRegistry } from './claim-topics-registry';
import { OnchainIDIdentity } from './onchain-id-identity';
import { Service } from 'typedi';

@Service()
export class EligibilityVerification {

  constructor(
    private readonly identityRegistry: IdentityRegistry,
    private readonly claimTopicsRegistry: ClaimTopicsRegistry,
    private readonly onchainIDIdentity: OnchainIDIdentity
  ) {}

  public getEligibilityVerification = async (
    identityRegistryAddress: string,
    signer: Signer,
    walletAddressToCheck: string | null = null
  ) => {
    const walletAddress = walletAddressToCheck || await signer.getAddress();

    const identityRegistryContract = this.identityRegistry.init(
      identityRegistryAddress,
      signer
    );

    const identityIsVerified = await identityRegistryContract.isVerified(walletAddress);

    const identityAddress = await identityRegistryContract.identity(walletAddress);

    if (identityAddress === constants.AddressZero) {
      throw new Error(`There is no OnChainID associated with address ${walletAddress}`);
    }

    const topicsRegistryAddress = await identityRegistryContract.topicsRegistry();

    const claimTopicsRegistryContract = this.claimTopicsRegistry.init(
      topicsRegistryAddress,
      signer
    );

    const claimTopics = await claimTopicsRegistryContract.getClaimTopics();

    const onchainIDIdentityContract = this.onchainIDIdentity.init(identityAddress, signer)

    const claimsWithIssues = await onchainIDIdentityContract.getClaimsWithIssues(identityAddress, claimTopics);

    return {
      identityIsVerified,
      ...claimsWithIssues
    }
  }

  public getReceiverEligibilityVerificationReasons = async (
    identityRegistryAddress: string,
    signerOrProvider: Signer | providers.Web3Provider,
    addr: string
  ): Promise<void> => {
    const errors: string[] = [];

    try {
      const { identityIsVerified, missingClaimTopics, invalidClaims } = await this.getEligibilityVerification(
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
}


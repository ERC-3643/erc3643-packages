import { contracts } from '@tokenysolutions/t-rex';
import { Contract } from 'ethers';
import OnchainID from '@onchain-id/solidity';

export const eligibilityVerification = async (
  identityAddress: string,
  identityWallet: any,
  identityRegistryContract: any,
  deployer: any
) => {
  const identityContract: any = new Contract(
    identityAddress,
    OnchainID.contracts.Identity.abi,
    identityWallet
  );

  const topicsRegistryAddr = await identityRegistryContract.topicsRegistry();
  console.log('IdentityRegistry.topicsRegistry', topicsRegistryAddr);

  const claimTopicsRegistryContract: any = new Contract(
    topicsRegistryAddr,
    contracts.ClaimTopicsRegistry.abi,
    deployer
  );

  const claimTopics = await claimTopicsRegistryContract.getClaimTopics();

  for (const topic of claimTopics) {
    const claimIds = await identityContract.getClaimIdsByTopic(topic);
    console.log('IdentityClaim.getClaimIdsByTopic', claimIds);

    for(const claimId of claimIds) {
      const claim = await identityContract.getClaim(claimId);
      console.log('IdentityClaim.getClaim', claim);

      const claimIssuerContract: any = new Contract(
        claim[2],
        OnchainID.contracts.ClaimIssuer.abi,
        deployer
      );

      const isClaimValid = await claimIssuerContract.isClaimValid(
        identityAddress,
        topic,
        claim[3],
        claim[4]
      );
      console.log('ClaimIssuer.isClaimValid', isClaimValid);
    }
  }
}

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

  const missingClaimTopics = [];
  const invalidClaims = [];

  for (const topic of claimTopics) {
    const claimIds = await identityContract.getClaimIdsByTopic(topic);
    console.log('IdentityClaim.getClaimIdsByTopic', claimIds);

    if (!claimIds.length) {
      missingClaimTopics.push(topic);
    }

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

      if (!isClaimValid) {
        invalidClaims.push(claim);
      }
      // !!isClaimValid && invalidClaims.push(claim);
    }
  }

  if (missingClaimTopics.length) {
    console.log('missing claims', missingClaimTopics);
  }

  if (invalidClaims.length) {
    console.log('invalid claims', invalidClaims);
  }
}

export const getClaim = async (
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

  const claimIds = await identityContract.getClaimIdsByTopic(claimTopics[0]);
  console.log('IdentityClaim.getClaimIdsByTopic', claimIds);

  const claim = await identityContract.getClaim(claimIds[0]);
  console.log('IdentityClaim.getClaim', claim);

  return claim;
}

export const revokeClaim = async (
  claim: any,
  claimIssuer: any
) => {
  const claimIssuerContract: any = new Contract(
    claim[2],
    OnchainID.contracts.ClaimIssuer.abi,
    claimIssuer
  );

  console.log('Trying to revoke claim by signatue');
  const revokationRes = await claimIssuerContract.revokeClaimBySignature(claim.signature);
  await revokationRes.wait();
}

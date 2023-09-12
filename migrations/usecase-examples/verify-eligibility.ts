import { Contract } from 'ethers';
import OnchainID from '@onchain-id/solidity';
import {
  getOnChainIdAddressByWalletAddress,
  getIdentityContract,
  getClaimTopicsRegistryContract,
  ZERO_ADDRESS
} from './setup';
import { getClaim } from './get-claim';
import { addClaim } from './add-claim';
import { removeClaim } from './remove-claim';
import { registerCharlieIdentity } from './register-identity';

export const verifyAllIdentities = async (
  identityRegistryContract: any,
  aliceWallet: any,
  bobWallet: any,
  charlieWallet: any,
  claimIssuerWallet: any,
  deployerWallet: any
) => {
  console.log('\n', '=== Account eligibility verification ===');
  // Verify all identities
  await verifyIdentity(identityRegistryContract, aliceWallet, deployerWallet);
  await verifyIdentity(identityRegistryContract, bobWallet, deployerWallet);
  await verifyIdentity(identityRegistryContract, charlieWallet, deployerWallet);

  const { claim, claimId } = await getClaim(identityRegistryContract, aliceWallet, deployerWallet);

  // Remove claim and verify Alice's identity again
  await removeClaim(identityRegistryContract, aliceWallet, claimId);
  await verifyIdentity(identityRegistryContract, aliceWallet, deployerWallet);

  // Add claim back and verify Alice's identity again
  await addClaim(identityRegistryContract, aliceWallet, claim);
  await verifyIdentity(identityRegistryContract, aliceWallet, deployerWallet);

  // Register Charlie's OnChainId if it is not not registered
  await registerCharlieIdentity(identityRegistryContract, charlieWallet);

  // Verify Charlie again
  await verifyIdentity(identityRegistryContract, charlieWallet, deployerWallet);
}

const verifyIdentity = async (
  identityRegistryContract: any, // Identity Registry contract connected with token agent
  identityWallet: any, // Wallet that is associated with an OnChainID
  deployerWallet: any // Wallet that deployed the T-Rex contracts suite
) => {
  console.log(`Verifying ${identityWallet.address} ... `);
  const isVerified = await identityRegistryContract.isVerified(identityWallet.address);
  console.log(`Verification result for ${identityWallet.address}`, isVerified);

  if (!isVerified) {
    const onChainIdContractAddress = await getOnChainIdAddressByWalletAddress(
      identityRegistryContract,
      identityWallet.address
    );

    if (onChainIdContractAddress === ZERO_ADDRESS) {
      console.log(`There is no OnChainID associated with address ${identityWallet.address}`);

      return;
    }

    await checkClaims(
      onChainIdContractAddress,
      identityWallet,
      identityRegistryContract,
      deployerWallet
    );
  }
}

const checkClaims = async (
  onChainIdContractAddress: string,
  identityWallet: any,
  identityRegistryContract: any,
  deployerWallet: any
) => {
  const identityContract = getIdentityContract(onChainIdContractAddress, identityWallet);

  const claimTopicsRegistryContract = await getClaimTopicsRegistryContract(identityRegistryContract, deployerWallet);

  const claimTopics = await claimTopicsRegistryContract.getClaimTopics();

  const missingClaimTopics: any[] = [];
  const invalidClaims: any[] = [];

  for (const topic of claimTopics) {
    const claimIds = await identityContract.getClaimIdsByTopic(topic);

    !claimIds.length && missingClaimTopics.push(topic);

    for (const claimId of claimIds) {
      const claim = await identityContract.getClaim(claimId);

      const claimIssuerContract: any = new Contract(
        claim.issuer,
        OnchainID.contracts.ClaimIssuer.abi,
        deployerWallet
      );

      const isClaimValid = await claimIssuerContract.isClaimValid(
        onChainIdContractAddress,
        topic,
        claim.signature,
        claim.data
      );

      !isClaimValid && invalidClaims.push(claim);
    }
  }

  if (missingClaimTopics.length) {
    console.log(`Missing claim topics for OnChainID ${onChainIdContractAddress}`, missingClaimTopics);
  }

  if (invalidClaims.length) {
    console.log(`Invalid claims for OnChainID ${onChainIdContractAddress}`, invalidClaims);
  }

  return {
    missing: missingClaimTopics,
    invalid: invalidClaims
  };
}

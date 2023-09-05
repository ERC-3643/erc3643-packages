import { getClaimIssuerContract } from './setup';

export const revokeClaim = async (claim: any, claimIssuerWallet: any) => {
  const claimIssuerContract = getClaimIssuerContract(claim.issuer, claimIssuerWallet);

  console.log('Trying to revoke claim by signatue');
  const tx = await claimIssuerContract.revokeClaimBySignature(claim.signature);

  await tx.wait();
  console.log('Claim revoked');
}

import { getClaimIssuerContract } from './setup';

export const revokeClaim = async (claim: any, claimIssuerWallet: any) => {
  const claimIssuerContract = getClaimIssuerContract(claim.issuer, claimIssuerWallet);

  try {
    console.log('Trying to revoke claim by signatue');
    const tx = await claimIssuerContract.revokeClaimBySignature(claim.signature);

    await tx.wait();
    console.log('Claim revoked');
  } catch (error) {
    if ((error as any).reason === 'Conflict: Claim already revoked') {
      console.log('Claim already revoked');
      // TODO: Consider undoing the revokation and retry this action?
    } else {
      throw error;
    }
  }
}

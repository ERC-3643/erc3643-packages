import OnchainID from '@onchain-id/solidity';
import { Contract, Signer } from 'ethers';

export const getClaimIssuer = (contractAddress: string, signer: Signer) => {

  const contract = new Contract(
    contractAddress,
    OnchainID.contracts.ClaimIssuer.abi,
    signer
  );

  const isClaimValid = (
    onchainIdentityAddress: string,
    topic: string,
    signature: string,
    data: string
  ) => contract.isClaimValid(
    onchainIdentityAddress,
    topic,
    signature,
    data
  );

  return {
    contract,
    isClaimValid
  }
}
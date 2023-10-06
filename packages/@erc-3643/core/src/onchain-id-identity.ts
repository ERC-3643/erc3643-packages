import { contracts } from '@onchain-id/solidity';
import { Contract, Signer } from 'ethers';
import Container, { Service } from 'typedi';
import { BaseContract } from './base-contract';
import { ClaimIssuer } from './claim-issuer';

@Service()
export class OnchainIDIdentity {
  private _contract: Contract;
  private signer: Signer;

  constructor(
    private readonly baseContract: BaseContract,
    private readonly claimIssuer: ClaimIssuer
  ) {}

  public get contract() {
    return this._contract;
  }

  public getClaimIdsByTopic = (topic: string) => this._contract.getClaimIdsByTopic(topic);

  public getClaim = (claimId: string) => this._contract.getClaim(claimId);

  public getClaimsWithIssues = async (identityAddress: string, claimTopics: string[]) => {
    const missingClaimTopics = [];
    const invalidClaims = [];

    for (const topic of claimTopics) {
      const claimIds = await this.getClaimIdsByTopic(topic);

      !claimIds.length && missingClaimTopics.push(topic);

      for (const claimId of claimIds) {
        const claim = await this.getClaim(claimId);

        const claimIssuerContract = this.claimIssuer.init(claim.issuer, this.signer)

        const isValid = await claimIssuerContract.isClaimValid(
          identityAddress,
          topic,
          claim.signature,
          claim.data
        );

        !isValid && invalidClaims.push(claim);
      }
    }

    return {
      missingClaimTopics,
      invalidClaims
    }
  }

  public init = (
    contractAddress: string,
    signer?: Signer
  ) => {

    this._contract = this.baseContract.connect(
      contractAddress,
      contracts.Identity.abi,
      signer
    );

    this.signer = signer;

    return this;
  }
}

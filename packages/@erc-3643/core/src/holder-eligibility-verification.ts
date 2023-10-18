import { Service } from 'typedi';
import { Signer, providers } from 'ethers';
import { Token } from './token';
import { EligibilityVerification } from './eligibility-verification';

@Service()
export class HolderEligibilityVerification {

  constructor(
    private readonly token: Token,
    private readonly eligibilityVerification: EligibilityVerification
  ) {}

  public verifyHolderEligibility = async (
    tokenAddress: string,
    walletAddress: string,
    signerOrProvider: Signer | providers.Web3Provider
  ): Promise<void> => {
    const token = await this.token.init(tokenAddress, signerOrProvider as Signer);
    const identityRegistryAddress = await token.identityRegistry();

    return await this.eligibilityVerification.getReceiverEligibilityVerificationReasons(
      identityRegistryAddress,
      signerOrProvider as Signer,
      walletAddress
    );
  }
}

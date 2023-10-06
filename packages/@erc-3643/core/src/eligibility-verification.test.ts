import 'reflect-metadata';
import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import Container from 'typedi';
import { constants } from 'ethers';
import { BaseContract } from './base-contract';
import { EligibilityVerification } from './eligibility-verification';
import { IdentityRegistry } from './identity-registry';
import { ClaimTopicsRegistry } from './claim-topics-registry';
import { OnchainIDIdentity } from './onchain-id-identity';

const MockBaseContract = {
  connect: () => jest.fn()
}

const MockImplementation = (implementation = {}) => {
  init: jest.fn(() => implementation)
}

describe('Compliance', function () {
  let eligibilityVerification: EligibilityVerification;

  beforeEach(() => {

    Container.set(BaseContract, MockBaseContract);
    Container.set(IdentityRegistry, MockImplementation());
    Container.set(ClaimTopicsRegistry, MockImplementation());
    Container.set(OnchainIDIdentity, MockImplementation());

    eligibilityVerification = Container.get(EligibilityVerification);
  });

  describe('Eligibility Verification', () => {
    it('should fail if no identity', async () => {
      await eligibilityVerification.getEligibilityVerification(
        constants.AddressZero,
        {} as any,
        constants.AddressZero
      )
    })
  });
});
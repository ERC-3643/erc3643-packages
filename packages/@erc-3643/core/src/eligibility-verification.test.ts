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

const isVerified: any = jest.fn();
const identity: any = jest.fn();
const topicsRegistry: any = jest.fn();

const implIdentityRegistry = {
  isVerified,
  identity,
  topicsRegistry
};

const getClaimTopics: any = jest.fn();

const implClaimTopicsRegistry = {
  getClaimTopics
};


const getClaimsWithIssues: any = jest.fn();

const implOnchainIDIdentity = {
  getClaimsWithIssues
};

const MockImplementation = (implementation = {}) => ({
  init: jest.fn(() => implementation)
})

describe('Compliance', function () {
  let eligibilityVerification: EligibilityVerification;

  beforeEach(() => {

    Container.set(BaseContract, MockBaseContract);
    Container.set(IdentityRegistry, MockImplementation(implIdentityRegistry));
    Container.set(ClaimTopicsRegistry, MockImplementation(implClaimTopicsRegistry));
    Container.set(OnchainIDIdentity, MockImplementation(implOnchainIDIdentity));

    eligibilityVerification = Container.get(EligibilityVerification);
  });

  describe('Eligibility Verification', () => {
    it('should fail if no identity', async () => {

      jest.spyOn(implIdentityRegistry, 'identity').mockResolvedValue(constants.AddressZero);

      await expect(eligibilityVerification.getEligibilityVerification(
        constants.AddressZero,
        {} as any,
        constants.AddressZero
      )).rejects.toThrow('There is no OnChainID associated with address 0x0000000000000000000000000000000000000000');
    });

    it('should return values', async () => {

      jest.spyOn(implIdentityRegistry, 'identity').mockResolvedValue('0x123456456');
      jest.spyOn(implIdentityRegistry, 'topicsRegistry').mockResolvedValue('0x654321');
      jest.spyOn(implClaimTopicsRegistry, 'getClaimTopics').mockResolvedValue(['0x654321', '0x987654']);
      jest.spyOn(implIdentityRegistry, 'isVerified').mockResolvedValue(false);
      jest.spyOn(implOnchainIDIdentity, 'getClaimsWithIssues').mockResolvedValue({
        missingClaimTopics: [1],
        invalidClaims: [2]
      });

      expect(await eligibilityVerification.getEligibilityVerification(
        constants.AddressZero,
        {} as any,
        constants.AddressZero
      )).toEqual({"identityIsVerified": false, "invalidClaims": [2], "missingClaimTopics": [1]})
    });

    it('should return values with the reasons', async () => {

      jest.spyOn(implIdentityRegistry, 'identity').mockResolvedValue('0x123456456');
      jest.spyOn(implIdentityRegistry, 'topicsRegistry').mockResolvedValue('0x654321');
      jest.spyOn(implClaimTopicsRegistry, 'getClaimTopics').mockResolvedValue(['0x654321', '0x987654']);
      jest.spyOn(implIdentityRegistry, 'isVerified').mockResolvedValue(false);
      jest.spyOn(implOnchainIDIdentity, 'getClaimsWithIssues').mockResolvedValue({
        missingClaimTopics: [1],
        invalidClaims: [2]
      });

      await expect(eligibilityVerification.getReceiverEligibilityVerificationReasons(
        constants.AddressZero,
        {} as any,
        constants.AddressZero
      )).rejects.toThrow('Identity not eligible for transfer');
    });

  });
});
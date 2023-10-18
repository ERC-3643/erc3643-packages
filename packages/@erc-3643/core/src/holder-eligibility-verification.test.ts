import 'reflect-metadata';
import Container from 'typedi';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Token } from './token';
import { BaseContract } from './base-contract';
import { EligibilityVerification } from './eligibility-verification';
import { HolderEligibilityVerification } from './holder-eligibility-verification';

const MockBaseContract = {
  connect: () => jest.fn()
}

const implToken = {
  identityRegistry: jest.fn()
};

const getReceiverEligibilityVerificationReasons: any = jest.fn();

const implElgibilityVerification = {
  getReceiverEligibilityVerificationReasons
}

const MockImplementation = (implementation = {}) => ({
  init: jest.fn(() => implementation)
})

describe('HolderEligibilityVerification', () => {
  let holderEligibilityVerification: HolderEligibilityVerification;

  beforeEach(() => {
    Container.set(BaseContract, MockBaseContract);
    Container.set(Token, MockImplementation(implToken));
    Container.set(EligibilityVerification, implElgibilityVerification);

    holderEligibilityVerification = Container.get(HolderEligibilityVerification);
  });

  describe('verifyHolderEligibility', () => {
    it('should pass', async () => {
      jest.spyOn(implToken, 'identityRegistry');
      jest.spyOn(implElgibilityVerification, 'getReceiverEligibilityVerificationReasons');

      const result = await holderEligibilityVerification.verifyHolderEligibility(
        'tokenAddress',
        'walletAddress',
        {} as any
      );

      expect(result).toBeUndefined();
    });

    it('should propagate correct errors if not verified', async () => {
      jest.spyOn(implToken, 'identityRegistry');
      jest.spyOn(implElgibilityVerification, 'getReceiverEligibilityVerificationReasons')
        .mockRejectedValueOnce(new Error('Identity not eligible for transfer', { cause: ['error 1', 'error2'] }));

      expect.assertions(2);

      await holderEligibilityVerification.verifyHolderEligibility(
        'tokenAddress',
        'walletAddress',
        {} as any
      ).catch((error) => {
        expect(error.message).toBe('Identity not eligible for transfer');
        expect(error.cause).toEqual(['error 1', 'error2']);
      });
    });
  })
})

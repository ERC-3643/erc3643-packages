import 'reflect-metadata';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import Container from 'typedi';
import { BaseContract } from './base-contract';
import { TransferCompliance } from './transfer-compliance';
import { Token } from './token';
import { Compliance } from './compliance';
import { EligibilityVerification } from './eligibility-verification';

const MockBaseContract = {
  connect: () => jest.fn()
}
const areTransferPartiesFrozen: any = jest.fn();
const isEnoughSpendableBalance: any = jest.fn();

const implToken = {
  identityRegistry: jest.fn(),
  compliance: jest.fn(),
  areTransferPartiesFrozen,
  isEnoughSpendableBalance
};

const getReceiverEligibilityVerificationReasons: any = jest.fn();

const implElgibilityVerification = {
  getReceiverEligibilityVerificationReasons
}

const canTransferWithReasons: any = jest.fn();

const implCompliance = {
  canTransferWithReasons
}

const MockImplementation = (implementation = {}) => ({
  init: jest.fn(() => implementation)
})

describe('TransferCompliance', () => {
  let transferCompliance: TransferCompliance
  beforeEach(() => {
    Container.set(BaseContract, MockBaseContract);
    Container.set(Token, MockImplementation(implToken));
    Container.set(Compliance, MockImplementation(implCompliance));
    Container.set(EligibilityVerification, implElgibilityVerification);

    transferCompliance = Container.get(TransferCompliance);
  });

  describe('isTransferCompliant', () => {
    it('should pass', async () => {
      jest.spyOn(implToken, 'areTransferPartiesFrozen').mockResolvedValue(true);
      jest.spyOn(implToken, 'isEnoughSpendableBalance').mockResolvedValue(true);
      jest.spyOn(implElgibilityVerification, 'getReceiverEligibilityVerificationReasons').mockResolvedValue(true);
      jest.spyOn(implCompliance, 'canTransferWithReasons').mockResolvedValue(true);
      const result = await transferCompliance.isTransferCompliant(
        {} as any,
        'tokenAddress',
        'from',
        'to',
        10
      );

      expect(result).toEqual({
        result: true,
        errors: []
      });
    });

    it('should return reasons', async () => {
      jest.spyOn(implToken, 'areTransferPartiesFrozen').mockRejectedValue(new Error('Wallet is frozen', { cause: ['to is frozen', 'from is frozen'] }));
      jest.spyOn(implToken, 'isEnoughSpendableBalance').mockRejectedValue(new Error('Insufficient balance', { cause: [`Insufficient balance. Current spendable balance is 400`] }))
      jest.spyOn(implElgibilityVerification, 'getReceiverEligibilityVerificationReasons').mockRejectedValue(new Error('Identity not eligible for transfer', { cause: ['addr has missing claims with topics 0x222'] }))
      jest.spyOn(implCompliance, 'canTransferWithReasons').mockRejectedValue(new Error('Transfer is not compliant', { cause: ['Transfer is not compliant with module at 0x8977'] }))
      const result = await transferCompliance.isTransferCompliant(
        {} as any,
        'tokenAddress',
        'from',
        'to',
        10
      );

      expect(result).toEqual({
        result: false,
        errors: [
          "to is frozen,from is frozen",
          "Insufficient balance. Current spendable balance is 400",
          "addr has missing claims with topics 0x222",
          "Transfer is not compliant with module at 0x8977",
        ]
      });
    });
  })
})
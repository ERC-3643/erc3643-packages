import 'reflect-metadata';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import Container from 'typedi';
import { BaseContract } from './base-contract';
import { BigNumber, constants } from 'ethers';
import { Token } from './token';

const MockBaseContract = {
  connect: () => jest.fn()
}

describe('OnchainIDIdentity', function () {
  let token: Token;

  beforeEach(() => {
    Container.set(BaseContract, MockBaseContract);
    token = Container.get(Token);
  });

  describe('realBalanceOf', () => {
    it('should show real balance', async () => {
      jest.spyOn(token, 'balanceOf').mockResolvedValue(BigNumber.from("42"))
      jest.spyOn(token, 'frozenTokens').mockResolvedValue(BigNumber.from("40"))
      const result = await token.realBalanceOf(constants.AddressZero);

      expect(result).toEqual("2");
    });
  });

  describe('areTransferPartiesFrozen', () => {
    it('should pass', async () => {
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(false);
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(false);

      await expect(token.areTransferPartiesFrozen(
        constants.AddressZero,
        constants.AddressZero
      )).resolves.not.toThrow()
    });

    it('should fails if sender isFrozen', async () => {
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(true);
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(false);

      try {
        await token.areTransferPartiesFrozen(
          'SenderAddress',
          'ReceiverAddress'
        );
      } catch (e) {
        expect(e.cause).toEqual(["SenderAddress is frozen"]);
      }

    });

    it('should fails if receiver isFrozen', async () => {
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(false);
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(true);

      try {
        await token.areTransferPartiesFrozen(
          'SenderAddress',
          'ReceiverAddress'
        );
      } catch (e) {
        expect(e.cause).toEqual(["ReceiverAddress is frozen"]);
      }

    });

    it('should fails if both parties are frozen', async () => {
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(true);
      jest.spyOn(token, 'isWalletFrozen').mockResolvedValueOnce(true);

      try {
        await token.areTransferPartiesFrozen(
          'SenderAddress',
          'ReceiverAddress'
        );
      } catch (e) {
        expect(e.cause).toEqual(["SenderAddress is frozen", "ReceiverAddress is frozen"]);
      }

    });
  });

  describe('isEnoughSpendableBalance', () => {
    it('should pass', async () => {
      jest.spyOn(token, 'realBalanceOf').mockResolvedValue("42")
      await expect(token.isEnoughSpendableBalance(constants.AddressZero, 10))
        .resolves.not.toThrow()
    });

    it('should fail', async () => {
      jest.spyOn(token, 'realBalanceOf').mockResolvedValue("42");

      try {
        await token.isEnoughSpendableBalance(constants.AddressZero, 100);
      } catch (e) {
        expect(e.cause).toEqual(["Insufficient balance. Current spendable balance is 42"]);
      }
    })
  });
})

import 'reflect-metadata';
import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import Container from 'typedi';
import { BaseContract } from './base-contract';
import { ClaimIssuer } from './claim-issuer';
import { OnchainIDIdentity } from './onchain-id-identity';
import { constants } from 'ethers';


const isClaimValid: any = jest.fn();

const implClaimIssuer = {
  isClaimValid
};

const MockBaseContract = {
  connect: () => jest.fn()
}

const MockImplementation = (implementation = {}) => ({
  init: jest.fn(() => implementation)
})

describe('OnchainIDIdentity', function () {
  let onchainIDIdentity: OnchainIDIdentity;

  beforeEach(() => {

    Container.set(BaseContract, MockBaseContract);
    Container.set(ClaimIssuer, MockImplementation(implClaimIssuer));
    onchainIDIdentity = Container.get(OnchainIDIdentity);
  });

  afterEach(() => {

  });

  describe('getClaimsWithIssues', () => {
    it('should pass', async () => {

      const contract = onchainIDIdentity.init('', '' as any);

      jest.spyOn(onchainIDIdentity, 'getClaimIdsByTopic').mockResolvedValue([1,2,3,4]);
      jest.spyOn(onchainIDIdentity, 'getClaim').mockResolvedValue({});
      jest.spyOn(implClaimIssuer, 'isClaimValid').mockResolvedValue(true);

      const result = await contract.getClaimsWithIssues(constants.AddressZero, ['123456', '456789']);

      expect(result).toEqual({
        "invalidClaims": [],
        "missingClaimTopics": []
      });

    });

    it('should return missed claim topics', async () => {

      const contract = onchainIDIdentity.init('', '' as any);

      jest.spyOn(onchainIDIdentity, 'getClaimIdsByTopic')
        .mockResolvedValueOnce([1,2,3])
        .mockResolvedValueOnce([]);
      jest.spyOn(onchainIDIdentity, 'getClaim').mockResolvedValue({});
      jest.spyOn(implClaimIssuer, 'isClaimValid').mockResolvedValue(true);

      const result = await contract.getClaimsWithIssues(constants.AddressZero, ['123456', '456789']);

      expect(result).toEqual({
        "invalidClaims": [],
        "missingClaimTopics": ["456789"]
      });
    });

    it('should return invalid claims', async () => {

      const contract = onchainIDIdentity.init('', '' as any);

      jest.spyOn(onchainIDIdentity, 'getClaimIdsByTopic')
        .mockResolvedValueOnce([1,2,3]);
      jest.spyOn(onchainIDIdentity, 'getClaim').mockResolvedValue({ issuer: '0x87624' });
      jest.spyOn(implClaimIssuer, 'isClaimValid')
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const result = await contract.getClaimsWithIssues(constants.AddressZero, ['123456', '456789']);

      expect(result).toEqual({
        "invalidClaims": [{ "issuer": '0x87624' }, { "issuer": '0x87624' }],
        "missingClaimTopics": []
      });
    });

  });
})


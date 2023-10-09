import 'reflect-metadata';
import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import Container from 'typedi';
import { Compliance } from './compliance';
import { BaseContract } from './base-contract';
import { ComplianceModule } from './compliance-module';

const MockBaseContract = {
  connect: () => jest.fn()
}

const moduleCheck = jest.fn();

const mockImplementation = {
  moduleCheck
} as any;

const MockComplianceModule = {
  init: jest.fn(() => mockImplementation)
}

describe('Compliance', function () {
  let complianceContract: Compliance;

  beforeEach(() => {

    Container.set(BaseContract, MockBaseContract);
    Container.set(ComplianceModule, MockComplianceModule);
    complianceContract = Container.get(Compliance);
  });

  afterEach(() => {

  });

  describe('canTransferWithReasons', () => {
    it('should pass if canTransfer', async () => {

      const contract = complianceContract.init('', '' as any);

      jest.spyOn(complianceContract, 'canTransfer').mockResolvedValue(true);
      const getModules = jest.spyOn(complianceContract, 'getModules');

      await contract.canTransferWithReasons('0x0', '0x1', 100)

      expect(getModules).toHaveBeenCalledTimes(0);
    });

    it('should do nothing if no modules attached??', async () => {

      const contract = complianceContract.init('', '' as any);

      jest.spyOn(complianceContract, 'canTransfer').mockResolvedValue(false);
      const getModules = jest.spyOn(complianceContract, 'getModules');
      getModules.mockResolvedValue([]);

      await contract.canTransferWithReasons('0x0', '0x1', 100)

      expect(getModules).toHaveBeenCalledTimes(1);
    });

    it('should pass if all moduleCheck pass', async () => {

      const contract = complianceContract.init('', '' as any);

      jest.spyOn(complianceContract, 'canTransfer').mockResolvedValue(false);
      const getModules = jest.spyOn(complianceContract, 'getModules');
      getModules.mockResolvedValue([1, 2, 3]);
      jest.spyOn(mockImplementation, 'moduleCheck')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)

      await contract.canTransferWithReasons('0x0', '0x1', 100)

      expect(getModules).toHaveBeenCalledTimes(1);
    });

    it('should fail if at least one moduleCheck fails', async () => {

      const contract = complianceContract.init('', '' as any);

      jest.spyOn(complianceContract, 'canTransfer').mockResolvedValue(false);
      const getModules = jest.spyOn(complianceContract, 'getModules');
      getModules.mockResolvedValue([1, 2, 3]);
      jest.spyOn(mockImplementation, 'moduleCheck')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      await expect(contract.canTransferWithReasons('0x0', '0x1', 100))
        .rejects.toThrow('Transfer is not compliant');
    });
  });
})


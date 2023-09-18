import { contracts } from '@tokenysolutions/t-rex'
import { Contract, Signer } from 'ethers'
import { getComplianceModule } from './compliance-module';

export const getCompliance = (contractAddress: string, signer: Signer) => {
  const contract = new Contract(
    contractAddress,
    contracts.ModularCompliance.abi,
    signer
  );

  const canTransfer = (from: string, to: string, amount: number) => contract
    .canTransfer(from, to, amount);

  const getModules = () => contract.getModules();

  const canTransferWithReasons = async (from: string, to: string, amount: number): Promise<void> => {
    const errors: string[] = [];
    const isCompliant = await canTransfer(from, to, amount);

    if (isCompliant) return;

    const modules = await getModules();

    for (const moduleAddress of modules) {
      const { moduleCheck } = getComplianceModule(moduleAddress, contracts.AbstractModule.abi, signer);
      try {
        const isCompliantWithModule = await moduleCheck(from, to, amount, contractAddress);

        !isCompliantWithModule && errors.push(`Transfer is not compliant with module at ${moduleAddress}`);
      } catch (e) {
        errors.push(`Transfer is not compliant with module at ${moduleAddress}`);
      }    
    }

    if (errors.length) throw new Error('Transfer is not compliant', { cause: errors });
  }

  return {
    canTransfer,
    canTransferWithReasons,
    getModules,
    contract
  }
}
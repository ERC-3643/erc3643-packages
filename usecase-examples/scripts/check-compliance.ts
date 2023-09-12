import { Interface } from 'ethers';
import { getComplianceBetaContract, getCountryAllowComplianceModuleContract } from './setup';

export const checkCompliance = async (
  tokenContract: any,
  deployerWallet: any,
  identityRegistryContract: any,
  senderWallet: any,
  receiverWallet: any
) => {
  console.log('\n', '=== Checking compliance ===');
  const complianceBetaContract: any = await setComplianceToTokenAndReturnComplianceBeta(tokenContract, deployerWallet);

  const wallet1CountryCode = await identityRegistryContract.investorCountry(senderWallet.address);
  console.log('Sender country code', wallet1CountryCode);

  const wallet2CountryCode = await identityRegistryContract.investorCountry(receiverWallet.address);
  console.log('Receiver country code', wallet2CountryCode);

  const transferAllowanceBeforeWhitelistingCountries = await complianceBetaContract
    .canTransfer(senderWallet.address, receiverWallet.address, 5);
  console.log('Can Sender transfer 5 tokens to Receiver?', transferAllowanceBeforeWhitelistingCountries);

  if (transferAllowanceBeforeWhitelistingCountries) return;

  const modules = await complianceBetaContract.getModules();

  for (const moduleAddress of modules) {
    console.log(`Checking compliance module at ${moduleAddress} ...`);

    const countryAllowComplianceModuleContract = getCountryAllowComplianceModuleContract(moduleAddress, deployerWallet);

    const wallet1CountryCodeAllowed = await isCountryCodeAllowed(
      countryAllowComplianceModuleContract,
      complianceBetaContract,
      wallet1CountryCode
    );

    const wallet2CountryCodeAllowed = await isCountryCodeAllowed(
      countryAllowComplianceModuleContract,
      complianceBetaContract,
      wallet2CountryCode
    );

    if (!wallet1CountryCodeAllowed) {
      await allowCountryCode(
        complianceBetaContract,
        moduleAddress,
        countryAllowComplianceModuleContract,
        wallet1CountryCode
      );
    }

    if (!wallet2CountryCodeAllowed) {
      await allowCountryCode(
        complianceBetaContract,
        moduleAddress,
        countryAllowComplianceModuleContract,
        wallet2CountryCode
      );
    }
  }

  const transferAllowanceAfterWhitelistingCountries = await complianceBetaContract
    .canTransfer(senderWallet.address, receiverWallet.address, 5);
  console.log('Can Sender transfer 5 tokens to Receiver?', transferAllowanceAfterWhitelistingCountries);
}

const setComplianceToTokenAndReturnComplianceBeta = async (tokenContract: any, deployerWallet: any) => {
  const tokenContractFromDeployer = tokenContract.connect(deployerWallet);
  const complianceBetaContract: any = getComplianceBetaContract(deployerWallet);

  const complianceBetaContractAddress = await complianceBetaContract.getAddress();
  const txSetCompliance = await tokenContractFromDeployer.setCompliance(complianceBetaContractAddress);
  await txSetCompliance.wait();

  return complianceBetaContract;
}

const isCountryCodeAllowed = async (
  countryAllowComplianceModuleContract: any,
  complianceBetaContract: any,
  countryCode: number
) => {
  const countryCodeAllowed = await countryAllowComplianceModuleContract.isCountryAllowed(
    complianceBetaContract.target,
    countryCode
  );
  console.log(`Is country code ${countryCode} allowed?`, countryCodeAllowed);

  return countryCodeAllowed;
}

const allowCountryCode = async (
  complianceBetaContract: any,
  countryAllowComplianceModuleAddress: string,
  countryAllowComplianceModuleContract: any,
  countryCodeToAllow: number
) => {
  console.log(`Allowing country code ${countryCodeToAllow} ...`);

  const txWhitelistCountryCode = await complianceBetaContract.callModuleFunction(
    new Interface(['function addAllowedCountry(uint16 country)']).encodeFunctionData('addAllowedCountry', [countryCodeToAllow]),
    countryAllowComplianceModuleAddress
  );
  await txWhitelistCountryCode.wait();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const countryCodeCheck = await countryAllowComplianceModuleContract.isCountryAllowed(
    complianceBetaContract.target,
    countryCodeToAllow
  );
  console.log(`Is country code ${countryCodeToAllow} allowed now?`, countryCodeCheck);
}

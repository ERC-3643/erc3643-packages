import {
  deployImplementations,
  deployFullSuiteFixture,
  deploySuiteWithModularCompliancesFixture,
  deploySuiteWithModularCompliancesModulesFixture,
  setComplianceAndAllowCountryCodes,
} from './sepolia-trex-deployment';

/*
Notes:
Sepolia network sometimes seems to be "swallowing" the blocks
so you may need to break the below flow into even more pieces
to achieve successfull deployment.

Also look for average gas price and adjust the hardhat config
accordingly.
*/

(async () => {
  const context1: any = await deployImplementations();
  await new Promise((resolve) => setTimeout(resolve, 300000)); // wait 5m

  const context2: any = await deployFullSuiteFixture(context1);
  await new Promise((resolve) => setTimeout(resolve, 300000)); // wait 5m

  const context3: any = await deploySuiteWithModularCompliancesFixture(context2);
  await new Promise((resolve) => setTimeout(resolve, 300000)); // wait 5m

  const context4: any = await deploySuiteWithModularCompliancesModulesFixture(context3);
  await new Promise((resolve) => setTimeout(resolve, 300000)); // wait 5m

  const result: any = await setComplianceAndAllowCountryCodes(context4);

  for(const [key, contract] of Object.entries(result.suite)) {
    console.log(key.padEnd(25, ' '), (contract as any)?.address);
  }

  for(const [key, identity] of Object.entries(result.identities)) {
    console.log(key.padEnd(25, ' '), (identity as any)?.address);
  }
})();

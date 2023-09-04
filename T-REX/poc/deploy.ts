import { deploySuiteWithModularCompliancesModulesFixture } from '../test/fixtures/deploy-full-suite.fixture'
// import { inspect } from 'util';

(async () => {

  // const result = await deploySuiteWithModuleComplianceBoundToWallet();
  // const result = await deploySuiteWithModularCompliancesFixture();
  const result = await deploySuiteWithModularCompliancesModulesFixture();

  for(const [key, contract] of Object.entries(result.suite)) {
    console.log(key.padEnd(25, ' '), contract.address);
  }
  for(const [key, contract] of Object.entries(result.identities)) {
    console.log(key.padEnd(25, ' '), contract.address);
  }
  // console.log('TokenAddress', result.suite.token.address);
})()
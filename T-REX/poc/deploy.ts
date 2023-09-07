import { deploySuiteWithModularCompliancesModulesFixture, deploySuiteWithSetComplianceAndAllowedCountries } from '../test/fixtures/deploy-full-suite.fixture';

(async () => {
  // const result = await deploySuiteWithModuleComplianceBoundToWallet();
  // const result = await deploySuiteWithModularCompliancesFixture();
  const result = await deploySuiteWithModularCompliancesModulesFixture();
  // const result = await deploySuiteWithSetComplianceAndAllowedCountries();

  for(const [key, contract] of Object.entries(result.suite)) {
    console.log(key.padEnd(25, ' '), contract.address);
  }

  for(const [key, identity] of Object.entries(result.identities)) {
    console.log(key.padEnd(25, ' '), identity.address);
  }
})();

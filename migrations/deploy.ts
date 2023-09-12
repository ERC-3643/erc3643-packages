import { deploySuiteWithModularCompliancesModulesFixture } from '../T-REX/test/fixtures/deploy-full-suite.fixture';
import { setComplianceAndAllowCountryCodes, registerCharlieIdentity } from './sepolia-trex-deployment';

(async () => {
  const context = await deploySuiteWithModularCompliancesModulesFixture();
  await registerCharlieIdentity(context); 
  const result: any = await setComplianceAndAllowCountryCodes(context);

  for(const [key, contract] of Object.entries(result.suite)) {
    console.log(key.padEnd(25, ' '), (contract as any).address);
  }

  for(const [key, identity] of Object.entries(result.identities)) {
    console.log(key.padEnd(25, ' '), (identity as any).address);
  }
})();

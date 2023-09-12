import { deploySuiteWithModularCompliancesFixture } from '../T-REX/test/fixtures/deploy-full-suite.fixture';
import {
  deploySuiteWithModularCompliancesModulesFixture,
  setComplianceAndAllowCountryCodes,
  registerCharlieIdentity
} from './sepolia-trex-deployment';

(async () => {
  const initialContext = await deploySuiteWithModularCompliancesFixture();
  const contextWithModules = await deploySuiteWithModularCompliancesModulesFixture(initialContext);
  await registerCharlieIdentity(contextWithModules); 
  const result: any = await setComplianceAndAllowCountryCodes(contextWithModules);

  for(const [key, contract] of Object.entries(result.suite)) {
    console.log(key.padEnd(25, ' '), (contract as any).address);
  }

  for(const [key, identity] of Object.entries(result.identities)) {
    console.log(key.padEnd(25, ' '), (identity as any).address);
  }
})();

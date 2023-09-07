import { deployTrexEcosystemToSepolia } from './sepolia-trex-deployment';

(async () => {
  const result = await deployTrexEcosystemToSepolia();

  for(const [key, contract] of Object.entries(result.suite)) {
    console.log(key.padEnd(25, ' '), contract.address);
  }

  for(const [key, identity] of Object.entries(result.identities)) {
    console.log(key.padEnd(25, ' '), identity.address);
  }

})();

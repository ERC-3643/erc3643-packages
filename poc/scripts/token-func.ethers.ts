import { JsonRpcProvider } from 'ethers';

import {
  getTokenContract,
  getIdentityRegistryContract
} from './setup';
import { getSigners } from './signers';
import { getClaim } from './get-claim';
import { verifyIdentity } from './verify-eligibility';
import { revokeClaim } from './revoke-claim';
import { registerCharlieIdentity } from './register-identity';

const TOKEN_PROXY = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE';

(async () => {
  const rpc =  new JsonRpcProvider('http://localhost:8545');

  const {
    deployer,
    tokenAgent,
    aliceWallet,
    claimIssuer,
    bobWallet,
    charlieWallet,
    anotherWallet10
  } = getSigners(rpc);

  const token = getTokenContract(TOKEN_PROXY, tokenAgent);
  const identityRegistry = await getIdentityRegistryContract(token, tokenAgent);
    
  // const tokenAlice: any = tokenContract.connect(aliceWallet);

  // console.log('\n', '-= Token info =-')
  // console.log('Token.owner', await token.owner());
  // console.log('Token.name', await token.name());
  // console.log('Token.totalSupply', await token.totalSupply());
  // console.log('Token.decimals', await token.decimals());
  // console.log('Token.balanceOf owner', await token.balanceOf(
  //   deployer.address
  // ));
  // console.log('Token.balanceOf Alice', await token.balanceOf(
  //   aliceWallet.address
  // ));

  // console.log('\n', '-= Pause manipulation =-')
  // const pause = await token.pause();
  // await pause.wait();
  // console.log('Token is paused', await token.paused());
  // const unpause = await token.unpause();
  // await unpause.wait();
  // console.log('Token is paused', await token.paused());

  // console.log('\n', '-= Token transfers =-')
  // console.log('Token.transfer aliceWallet -> bobWallet', 5);
  // const transfer = await tokenAlice.transfer(bobWallet.address, 5);
  // await transfer.wait();
  // const bobWalletBalance = await tokenAlice.balanceOf(
  //   bobWallet.address
  // );
  // console.log('Token.balanceOf bobWallet', bobWalletBalance);

  // console.log('\n', '-= Token freezed =-');
  // console.log('Token.freezePartialTokens bobWallet', 10);
  // const freezeTokens = await token.freezePartialTokens(bobWallet.address, 10);
  // await freezeTokens.wait();
  // const frozenTokens = await token.getFrozenTokens(bobWallet.address);
  // console.log('Token.getFrozenTokens bobWallet', frozenTokens);
  // console.log('Token.balanceOf bobWallet', bobWalletBalance);
  // console.log('Token.balanceOf bobWallet real', bobWalletBalance - frozenTokens);

  // console.log('\n', '-= Wallet freezed =-');
  // let isFrozen = await token.isFrozen(anotherWallet10.address);
  // console.log('Token.isFrozen anotherWallet10', isFrozen);

  // if (!isFrozen) {
  //   console.log('Token.setAddressFrozen anotherWallet10');
  //   const freezeWallet = await token.setAddressFrozen(anotherWallet10.address, true);
  //   await freezeWallet.wait();
  //   isFrozen = await token.isFrozen(anotherWallet10.address);
  //   console.log('Token.isFrozen anotherWallet10', isFrozen);
  // } else {
  //   const unfreezeWallet = await token.setAddressFrozen(anotherWallet10.address, false);
  //   await unfreezeWallet.wait();
  //   isFrozen = await token.isFrozen(anotherWallet10.address);
  //   console.log('Token.isFrozen anotherWallet10', isFrozen);
  // }

  // console.log('\n', '-= Compliance =-');
  // const COMPLIANCE_BETA = '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E';

  // const complianceContract = new Contract(
  //   COMPLIANCE_BETA,
  //   contracts.ModularCompliance.abi
  // );

  // const tokenTokenContract = new Contract(
  //   TOKEN_PROXY,
  //   contracts.Token.abi,
  //   deployer
  // );

  // const tokenAddCompliance = await tokenTokenContract.setCompliance(await complianceContract.getAddress());
  // await tokenAddCompliance.wait();
  // console.log('Token.setCompliance');

  // const compliance: any = complianceContract.connect(deployer);
  // const tokenBinded = await compliance.getTokenBound();
  // console.log('Compliance.getTokenBound', tokenBinded)

  // const modules = await compliance.getModules();
  // console.log('Compliance.getModules', modules);

  // const countrySetBob = await identityRegistry.updateCountry(bobWallet.address, 42);
  // await countrySetBob.wait();
  // const getInvestorCountryBob = await identityRegistry.investorCountry(bobWallet.address);
  // console.log('IdentityRegistry.updateCountry bobWallet.address', getInvestorCountryBob);

  // // Wait for correct nonce
  // console.log('\n', 'Manual delay', '\n')
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // const countrySetAlice = await identityRegistry.updateCountry(aliceWallet.address, 42);
  // await countrySetAlice.wait();
  // const getInvestorCountryAlice = await identityRegistry.investorCountry(aliceWallet.address);
  // console.log('IdentityRegistry.updateCountry aliceWallet.address', getInvestorCountryAlice);

  // for (const addr of modules) {
  //   const complianceModule = new Contract(
  //     addr,
  //     contracts.CountryAllowModule.abi
  //   );
  //   const moduleAddr: any = complianceModule.connect(deployer);
  //   const countryAlowed = await moduleAddr.isCountryAllowed(compliance.target, 42);
  //   console.log('Check moduleAddr.isCountryAllowed', countryAlowed);

  //   if (!countryAlowed) {
  //     const lala = await compliance.callModuleFunction(
  //       new Interface(['function addAllowedCountry(uint16 country)']).encodeFunctionData('addAllowedCountry', [42]),
  //       addr,
  //     );
  //     await lala.wait();

  //     const countryAlowed2 = await moduleAddr.isCountryAllowed(compliance.target, 42);
  //     console.log('Set moduleAddr.isCountryAllowed', countryAlowed2);
  //   }

  //   const allowModule = await moduleAddr.moduleCheck(aliceWallet.address, bobWallet.address, 5, compliance.target);
  //   console.log('ModularCompliance.moduleCheck', allowModule);
  // }

  // const transferAnother = await compliance.canTransfer(aliceWallet.address, bobWallet.address, 5);
  // console.log('Compliance.canTransfer aliceWallet -> bobWallet', transferAnother);

  console.log('\n', '=== Account eligibility verification ===');

  // Verify all identities
  await verifyIdentity(identityRegistry, aliceWallet, deployer);
  await verifyIdentity(identityRegistry, bobWallet, deployer);
  await verifyIdentity(identityRegistry, charlieWallet, deployer);

  // Revoke a claim and verify Alice's identity
  const claim = await getClaim(identityRegistry, aliceWallet, deployer);
  await revokeClaim(claim, claimIssuer);
  await verifyIdentity(identityRegistry, aliceWallet, deployer);

  // Register Charlie's OnChainId if it is not not registered
  await registerCharlieIdentity(identityRegistry, charlieWallet);

  // Verify Charlie again
  await verifyIdentity(identityRegistry, charlieWallet, deployer);
})()

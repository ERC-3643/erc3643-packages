import { contracts } from '@tokenysolutions/t-rex';
import { JsonRpcProvider, Contract, Interface } from "ethers";
import OnchainID from "@onchain-id/solidity";

import { getSigners } from './signers';
import { eligibilityVerification, getClaim, revokeClaim } from './eligibility-verification';

const TOKEN_PROXY = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE';

(async () => {
  const rpc =  await new JsonRpcProvider( 'http://localhost:8545' );

  const {
    deployer,
    tokenAgent,
    aliceWallet,
    claimIssuer,
    bobWallet,
    charlieWallet,
    anotherWallet10
  } = getSigners(rpc);

  const tokenContract = new Contract(
    TOKEN_PROXY,
    contracts.Token.abi
  );

  const token: any = tokenContract.connect(tokenAgent);
  
  const identityRegistryAddress = await token.identityRegistry();
  const identityRegistryContract = new Contract(
    identityRegistryAddress,
    contracts.IdentityRegistry.abi
  );
    
  const identityRegistry: any = identityRegistryContract.connect(tokenAgent);
    
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

  // console.log('\n', '-= Account verification =-');

  // Alice verified true
  const isVerifiedAlice = await identityRegistry.isVerified(aliceWallet.address);
  console.log('IdentityRegistry.verified aliceWallet', isVerifiedAlice);
  const identityAlice = await identityRegistry.identity(aliceWallet.address);
  console.log('IdentityRegistry.identity aliceWallet', identityAlice);

  console.log('Performing eligibility before claim revokation ...');
  if (!isVerifiedAlice) {
    await eligibilityVerification(identityAlice, aliceWallet, identityRegistry, deployer);
  }

  const claim = await getClaim(identityAlice, aliceWallet, identityRegistry, deployer);
  await revokeClaim(claim, claimIssuer);

  console.log('Performing eligibility after claim revokation ...');

  const isVerifiedAfterRevokationAlice = await identityRegistry.isVerified(aliceWallet.address);
  console.log('IdentityRegistry.verified aliceWallet', isVerifiedAfterRevokationAlice);

  if (!isVerifiedAfterRevokationAlice) {
    await eligibilityVerification(identityAlice, aliceWallet, identityRegistry, deployer);
  }

  // Bob verified true
  // const isVerifiedBob = await identityRegistry.isVerified(bobWallet.address);
  // console.log('IdentityRegistry.verified bobWallet', isVerifiedAlice);
  // const identityBob = await identityRegistry.identity(bobWallet.address);
  // console.log('IdentityRegistry.identity bobWallet', identityBob);

  // if (!isVerifiedBob) {
  //   await eligibilityVerification(identityBob, bobWallet, identityRegistry, deployer);
  // }

  // Charlie verified false (identities must be registered)
  // if (!(await identityRegistry.contains(charlieWallet.address))) {
  //   const charlieOnChainIDAddress = '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f';

  //   await identityRegistry.registerIdentity(charlieWallet.address, charlieOnChainIDAddress, 42)
  // }

  // const isVerifiedCharlie = await identityRegistry.isVerified(charlieWallet.address);
  // console.log('IdentityRegistry.verified charlieWallet', isVerifiedCharlie);
  // const identityCharly = await identityRegistry.identity(charlieWallet.address);
  // console.log('IdentityRegistry.identity charlieWallet', identityCharly);

  // if (!isVerifiedCharlie) {
  //   await eligibilityVerification(identityCharly, charlieWallet, identityRegistry, deployer);
  // }

})()

import { contracts } from '@tokenysolutions/t-rex';
import { Wallet, JsonRpcProvider, Contract, Interface, id, keccak256, toUtf8Bytes } from "ethers";
import OnchainID from "@onchain-id/solidity";
// import { ethers } from 'hardhat';


const getSigners = (rpc: JsonRpcProvider): { [key: string]: Wallet } => {
  const accounts = {
    deployer: {
      account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
    tokenIssuer: {
      account: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    },
    tokenAgent: {
      account: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    },
    tokenAdmin: {
      account: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6'
    },
    claimIssuer: {
      account: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
    },
    aliceWallet: {
      account: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
      privateKey: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
    },
    bobWallet: {
      account: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
      privateKey: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e'
    },
    charlieWallet: {
      account: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
      privateKey: '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
    },
    davidWallet: {
      account: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
      privateKey: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
    },
    anotherWallet: {
      account: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
      privateKey: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
    },
    anotherWallet1: {
      account: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
      privateKey: '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897',
    },
    anotherWallet2: {
      account: '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
      privateKey: '0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82',
    },
    anotherWallet3: {
      account: '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
      privateKey: '0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1',
    },
    anotherWallet4: {
      account: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
      privateKey: '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd',
    },
    anotherWallet5: {
      account: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
      privateKey: '0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa',
    },
    anotherWallet6: {
      account: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
      privateKey: '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61',
    },
    anotherWallet7: {
      account: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
      privateKey: '0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0',
    },
    anotherWallet8: {
      account: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
      privateKey: '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd',
    },
    anotherWallet9: {
      account: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      privateKey: '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',
    },
    anotherWallet10: {
      account: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      privateKey: '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'
    }
  }

  return Object.entries(accounts)
    .reduce((acc, [key, wallet]) => ({
      ...acc,
      [key]: new Wallet( wallet.privateKey, rpc)
    }), {})
}

const TOKEN_PROXY = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE';

(async () => {
  const rpc =  await new JsonRpcProvider( 'http://localhost:8545' );

  const {
    deployer,
    tokenAgent,
    aliceWallet,
    bobWallet,
    charlieWallet,
    anotherWallet10
  } = getSigners(rpc);

  const tokenContract = new Contract(
    TOKEN_PROXY,
    contracts.Token.abi
  );

  const token: any = tokenContract.connect(tokenAgent);
  const tokenAlice: any = tokenContract.connect(aliceWallet);

  console.log('\n', '-= Token info =-')
  console.log('Token.owner', await token.owner());
  console.log('Token.name', await token.name());
  console.log('Token.totalSupply', await token.totalSupply());
  console.log('Token.decimals', await token.decimals());
  console.log('Token.balanceOf owner', await token.balanceOf(
    deployer.address
  ));
  console.log('Token.balanceOf Alice', await token.balanceOf(
    aliceWallet.address
  ));

  console.log('\n', '-= Pause manipulation =-')
  const pause = await token.pause();
  await pause.wait();
  console.log('Token is paused', await token.paused());
  const unpause = await token.unpause();
  await unpause.wait();
  console.log('Token is paused', await token.paused());

  console.log('\n', '-= Token transfers =-')
  console.log('Token.transfer aliceWallet -> bobWallet', 5);
  const transfer = await tokenAlice.transfer(bobWallet.address, 5);
  await transfer.wait();
  const bobWalletBalance = await tokenAlice.balanceOf(
    bobWallet.address
  );
  console.log('Token.balanceOf bobWallet', bobWalletBalance);

  console.log('\n', '-= Token freezed =-');
  console.log('Token.freezePartialTokens bobWallet', 10);
  const freezeTokens = await token.freezePartialTokens(bobWallet.address, 10);
  await freezeTokens.wait();
  const frozenTokens = await token.getFrozenTokens(bobWallet.address);
  console.log('Token.getFrozenTokens bobWallet', frozenTokens);
  console.log('Token.balanceOf bobWallet', bobWalletBalance);
  console.log('Token.balanceOf bobWallet real', bobWalletBalance - frozenTokens);

  console.log('\n', '-= Wallet freezed =-');
  let isFrozen = await token.isFrozen(anotherWallet10.address);
  console.log('Token.isFrozen anotherWallet10', isFrozen);

  if (!isFrozen) {
    console.log('Token.setAddressFrozen anotherWallet10');
    const freezeWallet = await token.setAddressFrozen(anotherWallet10.address, true);
    await freezeWallet.wait();
    isFrozen = await token.isFrozen(anotherWallet10.address);
    console.log('Token.isFrozen anotherWallet10', isFrozen);
  } else {
    const unfreezeWallet = await token.setAddressFrozen(anotherWallet10.address, false);
    await unfreezeWallet.wait();
    isFrozen = await token.isFrozen(anotherWallet10.address);
    console.log('Token.isFrozen anotherWallet10', isFrozen);
  }

  console.log('\n', '-= Compliance =-');
  const COMPLIANCE_BETA = '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E';

  const identityRegistryAddress = await token.identityRegistry();
  const identityRegistryContract = new Contract(
    identityRegistryAddress,
    contracts.IdentityRegistry.abi
  );

  const identityRegistry: any = identityRegistryContract.connect(tokenAgent);

  const complianceContract = new Contract(
    COMPLIANCE_BETA,
    contracts.ModularCompliance.abi
  );

  const tokenTokenContract = new Contract(
    TOKEN_PROXY,
    contracts.Token.abi,
    deployer
  );

  const tokenAddCompliance = await tokenTokenContract.setCompliance(await complianceContract.getAddress());
  await tokenAddCompliance.wait();
  console.log('Token.setCompliance');

  const compliance: any = complianceContract.connect(deployer);
  const tokenBinded = await compliance.getTokenBound();
  console.log('Compliance.getTokenBound', tokenBinded)

  const modules = await compliance.getModules();
  console.log('Compliance.getModules', modules);

  const countrySetBob = await identityRegistry.updateCountry(bobWallet.address, 10);
  await countrySetBob.wait();
  const getInvestorCountryBob = await identityRegistry.investorCountry(bobWallet.address);
  console.log('IdentityRegistry.updateCountry bobWallet.address', getInvestorCountryBob);

  // Wait for correct nonce
  console.log('\n', 'Manual delay', '\n')
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const countrySetAlice = await identityRegistry.updateCountry(aliceWallet.address, 42);
  await countrySetAlice.wait();
  const getInvestorCountryAlice = await identityRegistry.investorCountry(aliceWallet.address);
  console.log('IdentityRegistry.updateCountry aliceWallet.address', getInvestorCountryAlice);

  for (const addr of modules) {
    const complianceModule = new Contract(
      addr,
      contracts.CountryAllowModule.abi
    );
    const moduleAddr: any = complianceModule.connect(deployer);
    const countryAlowed = await moduleAddr.isCountryAllowed(compliance.target, 42);
    console.log('Check moduleAddr.isCountryAllowed', countryAlowed);

    if (!countryAlowed) {
      const lala = await compliance.callModuleFunction(
        new Interface(['function addAllowedCountry(uint16 country)']).encodeFunctionData('addAllowedCountry', [42]),
        addr,
      );
      await lala.wait();

      const countryAlowed2 = await moduleAddr.isCountryAllowed(compliance.target, 42);
      console.log('Set moduleAddr.isCountryAllowed', countryAlowed2);
    }

    const allowModule = await moduleAddr.moduleCheck(aliceWallet.address, bobWallet.address, 5, compliance.target);
    console.log('ModularCompliance.moduleCheck', allowModule);
  }

  const transferAnother = await compliance.canTransfer(aliceWallet.address, bobWallet.address, 5);
  console.log('Compliance.canTransfer aliceWallet -> bobWallet', transferAnother);

  console.log('\n', '-= Account verification =-');

  const isVerifiedAlice = await identityRegistry.isVerified(aliceWallet.address);
  console.log('IdentityRegistry.verified aliceWallet', isVerifiedAlice);
  const identityAlice = await identityRegistry.identity(aliceWallet.address);
  console.log('IdentityRegistry.identity aliceWallet', identityAlice);

  const isVerifiedAnotherCharlieWallet = await identityRegistry.isVerified(charlieWallet.address);
  console.log('IdentityRegistry.verified charlieWallet', isVerifiedAnotherCharlieWallet);
  const identityCharly = await identityRegistry.identity(charlieWallet.address);
  console.log('IdentityRegistry.identity charlieWallet', identityCharly);

  const identityClaim: any = new Contract(
    identityAlice,
    OnchainID.contracts.Identity.abi,
    aliceWallet
  );

  const topicsRegistryAddr = await identityRegistry.topicsRegistry();
  console.log('IdentityRegistry.topicsRegistry', topicsRegistryAddr);

  const topicsRegistry: any = new Contract(
    topicsRegistryAddr,
    contracts.ClaimTopicsRegistry.abi,
    deployer
  );

  const claimTopics = await topicsRegistry.getClaimTopics();

  for (const topic of claimTopics) {
    const claimIds = await identityClaim.getClaimIdsByTopic(topic);
    console.log('IdentityClaim.getClaimIdsByTopic', claimIds);

    for(const claimId of claimIds) {

      const claim = await identityClaim.getClaim(claimId);
      console.log('IdentityClaim.getClaim', claim);
      const claimIssuer: any = new Contract(
        claim[2],
        OnchainID.contracts.ClaimIssuer.abi,
        deployer
      );

      const isClaimValid = await claimIssuer.isClaimValid(
        identityAlice,
        topic,
        claim[3],
        claim[4]
      );
      console.log('ClaimIssuer.isClaimValid', isClaimValid);
    }
  }

})()
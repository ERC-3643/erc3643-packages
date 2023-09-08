import {BigNumber, Contract, Signer, utils} from "ethers";
import {ethers} from "hardhat";
import OnchainID from "@onchain-id/solidity";

const GLOBAL_CONTRACT_TIMEOUT = 120000;
const GLOBAL_TX_TIMEOUT = 60000;

const waitContractDeployment = async (contractName: string, contractObj: any, additionalSeconds: number = 0) => {
  console.log('\n', `Sent tx to deploy contract ${contractName} ${new Date()}`);
  await new Promise((resolve) => setTimeout(resolve, GLOBAL_CONTRACT_TIMEOUT + additionalSeconds * 1000));
  console.log(`Deployed contract ${contractName}`, contractObj?.address);
}

const waitTx = async (txName: string) => {
  console.log('\n', `Sent tx ${txName} ${new Date()}`);
  await new Promise((resolve) => setTimeout(resolve, GLOBAL_TX_TIMEOUT));
  console.log(`Waited ${GLOBAL_TX_TIMEOUT}`);
}

export async function deployIdentityProxy(implementationAuthority: Contract['address'], managementKey: string, signer: Signer) {
  const identity = await new ethers.ContractFactory(
      OnchainID.contracts.IdentityProxy.abi,
      OnchainID.contracts.IdentityProxy.bytecode,
      signer
    ).deploy(
      implementationAuthority,
      managementKey
    );
  await waitContractDeployment('OnchainID.contracts.IdentityProxy.abi', identity);

  return ethers.getContractAt("Identity", identity.address, signer);
}

export const sepolia1 = async () => {
  const [
    deployer,
    tokenIssuer,
    tokenAgent,
    tokenAdmin,
    claimIssuer,
    aliceWallet,
    bobWallet,
    charlieWallet,
    davidWallet,
    anotherWallet
  ] = await ethers.getSigners();
  const claimIssuerSigningKey = claimIssuer;
  const aliceActionKey = aliceWallet;

  console.log('deployer', deployer.address);
  console.log('tokenAgent', tokenAgent.address);
  console.log('claimIssuer' ,claimIssuer.address);
  console.log('aliceWallet', aliceWallet.address);
  console.log('bobWallet', bobWallet.address);
  console.log('charlieWallet', charlieWallet.address);

  // Deploy implementations
  const claimTopicsRegistryImplementation = await ethers.deployContract('ClaimTopicsRegistry', deployer);
  await waitContractDeployment('ClaimTopicsRegistry', claimTopicsRegistryImplementation);

  const trustedIssuersRegistryImplementation = await ethers.deployContract('TrustedIssuersRegistry', deployer);
  await waitContractDeployment('TrustedIssuersRegistry', trustedIssuersRegistryImplementation);

  const identityRegistryStorageImplementation = await ethers.deployContract('IdentityRegistryStorage', deployer);
  await waitContractDeployment('IdentityRegistryStorage', identityRegistryStorageImplementation);

  const identityRegistryImplementation = await ethers.deployContract('IdentityRegistry', deployer);
  await waitContractDeployment('IdentityRegistry', identityRegistryImplementation);

  const modularComplianceImplementation = await ethers.deployContract('ModularCompliance', deployer);
  await waitContractDeployment('ModularCompliance', modularComplianceImplementation);

  const tokenImplementation = await ethers.deployContract('Token', deployer);
  await waitContractDeployment('Token', tokenImplementation, 60);

  const identityImplementation = await new ethers.ContractFactory(
    OnchainID.contracts.Identity.abi,
    OnchainID.contracts.Identity.bytecode,
    deployer
  ).deploy(deployer.address, true);
  await waitContractDeployment('identityImplementation', identityImplementation);

  const identityImplementationAuthority = await new ethers.ContractFactory(
    OnchainID.contracts.ImplementationAuthority.abi,
    OnchainID.contracts.ImplementationAuthority.bytecode,
    deployer
  ).deploy(identityImplementation.address);
  await waitContractDeployment('identityImplementationAuthority', identityImplementationAuthority);

  const trexImplementationAuthority = await ethers.deployContract(
    'TREXImplementationAuthority',
    [true, ethers.constants.AddressZero, ethers.constants.AddressZero],
    deployer
  );
  await waitContractDeployment('TREXImplementationAuthority', trexImplementationAuthority);

  const versionStruct = {
    major: 4,
    minor: 0,
    patch: 0
  };
  const contractsStruct = {
    tokenImplementation: tokenImplementation.address,
    ctrImplementation: claimTopicsRegistryImplementation.address,
    irImplementation: identityRegistryImplementation.address,
    irsImplementation: identityRegistryStorageImplementation.address,
    tirImplementation: trustedIssuersRegistryImplementation.address,
    mcImplementation: modularComplianceImplementation.address
  };
  await trexImplementationAuthority.connect(deployer).addAndUseTREXVersion(versionStruct, contractsStruct);
  await waitTx('addAndUseTREXVersion');

  const trexFactory = await ethers.deployContract('TREXFactory', [trexImplementationAuthority.address], deployer);
  await waitContractDeployment('TREXFactory', trexFactory, 60);

  const claimTopicsRegistryProxy = await ethers.deployContract('ClaimTopicsRegistryProxy', [trexImplementationAuthority.address], deployer);
  await waitContractDeployment('ClaimTopicsRegistryProxy', claimTopicsRegistryProxy);
  const claimTopicsRegistry = await ethers.getContractAt('ClaimTopicsRegistry', claimTopicsRegistryProxy.address);

  const trustedIssuersRegistryProxy = await ethers.deployContract('TrustedIssuersRegistryProxy', [trexImplementationAuthority.address], deployer);
  await waitContractDeployment('TrustedIssuersRegistryProxy', trustedIssuersRegistryProxy);
  const trustedIssuersRegistry = await ethers.getContractAt('TrustedIssuersRegistry', trustedIssuersRegistryProxy.address);

  const identityRegistryStorageProxy = await ethers.deployContract('IdentityRegistryStorageProxy', [trexImplementationAuthority.address], deployer);
  await waitContractDeployment('IdentityRegistryStorageProxy', identityRegistryStorageProxy);
  const identityRegistryStorage = await ethers.getContractAt('IdentityRegistryStorage', identityRegistryStorageProxy.address);

  const defaultCompliance = await ethers.deployContract('DefaultCompliance', deployer);
  await waitContractDeployment('DefaultCompliance', defaultCompliance);

  const identityRegistryProxy = await ethers
    .deployContract(
      'IdentityRegistryProxy',
      [trexImplementationAuthority.address, trustedIssuersRegistry.address, claimTopicsRegistry.address, identityRegistryStorage.address],
      deployer,
    );
  await waitContractDeployment('IdentityRegistryProxy', identityRegistryProxy);
  const identityRegistry = await ethers.getContractAt('IdentityRegistry', identityRegistryProxy.address);

  const tokenOID = await deployIdentityProxy(identityImplementationAuthority.address, tokenIssuer.address, deployer);

  return {
    accounts: {
      deployer,
      tokenIssuer,
      tokenAgent,
      tokenAdmin,
      claimIssuer,
      claimIssuerSigningKey,
      aliceActionKey,
      aliceWallet,
      bobWallet,
      charlieWallet,
      davidWallet,
      anotherWallet
    },
    suite: {
      claimTopicsRegistry,
      trustedIssuersRegistry,
      identityRegistryStorage,
      defaultCompliance,
      identityRegistry,
      tokenOID
    },
    authorities: {
      trexImplementationAuthority,
      identityImplementationAuthority
    },
    factories: {
      trexFactory
    },
    implementations: {
      identityImplementation,
      claimTopicsRegistryImplementation,
      trustedIssuersRegistryImplementation,
      identityRegistryStorageImplementation,
      identityRegistryImplementation,
      modularComplianceImplementation,
      tokenImplementation
    }
  };
}

export async function deployFullSuiteFixture(context: any) {
  const tokenName = 'TREXDINO';
  const tokenSymbol = 'TREX';
  const tokenDecimals = BigNumber.from('0');
  const tokenProxy = await ethers
    .deployContract(
      'TokenProxy',
      [
        context.authorities.trexImplementationAuthority.address,
        context.suite.identityRegistry.address,
        context.suite.defaultCompliance.address,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        context.suite.tokenOID.address,
      ],
      context.accounts.deployer,
    );
  await waitContractDeployment('TokenProxy', tokenProxy, 60);
  const token = await ethers.getContractAt('Token', tokenProxy.address);

  const agentManager = await ethers.deployContract('AgentManager', [token.address], context.accounts.tokenAgent);
  await waitContractDeployment('AgentManager', agentManager);

  await context.suite.identityRegistryStorage.connect(context.accounts.deployer).bindIdentityRegistry(context.suite.identityRegistry.address);
  await waitTx('bindIdentityRegistry');

  await token.connect(context.accounts.deployer).addAgent(context.accounts.tokenAgent.address);
  await waitTx('addAgent(tokenAgent.address)');

  const claimTopics = [ethers.utils.id('CLAIM_TOPIC')];
  await context.suite.claimTopicsRegistry.connect(context.accounts.deployer).addClaimTopic(claimTopics[0]);
  await waitTx('addClaimTopic');

  const claimIssuerContract = await ethers.deployContract('ClaimIssuer', [context.accounts.claimIssuer.address], context.accounts.claimIssuer);
  await waitContractDeployment('ClaimIssuer', claimIssuerContract);

  await claimIssuerContract
    .connect(context.accounts.claimIssuer)
    .addKey(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [context.accounts.claimIssuerSigningKey.address])), 3, 1);
  await waitTx('claimIssuer.addKey');

  await context.suite.trustedIssuersRegistry.connect(context.accounts.deployer).addTrustedIssuer(claimIssuerContract.address, claimTopics);
  await waitTx('addTrustedIssuer');

  const aliceIdentity = await deployIdentityProxy(context.authorities.identityImplementationAuthority.address, context.accounts.aliceWallet.address, context.accounts.deployer);
  await aliceIdentity.connect(context.accounts.aliceWallet).addKey(
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [context.accounts.aliceActionKey.address])),
    2,
    1
  );
  await waitTx('aliceIdentity.addKey');

  const bobIdentity = await deployIdentityProxy(context.authorities.identityImplementationAuthority.address, context.accounts.bobWallet.address, context.accounts.deployer);
  const charlieIdentity = await deployIdentityProxy(context.authorities.identityImplementationAuthority.address, context.accounts.charlieWallet.address, context.accounts.deployer);

  await context.suite.identityRegistry.connect(context.accounts.deployer).addAgent(context.accounts.tokenAgent.address);
  await waitTx('addAgent(tokenAgent.address)');

  await context.suite.identityRegistry.connect(context.accounts.deployer).addAgent(token.address);
  await waitTx('addAgent(token.address)');

  // .registerIdentity (adding Charlie here as well)
  await context.suite.identityRegistry.connect(context.accounts.tokenAgent).batchRegisterIdentity(
    [context.accounts.aliceWallet.address, context.accounts.bobWallet.address, context.accounts.charlieWallet.address],
    [aliceIdentity.address, bobIdentity.address, charlieIdentity.address],
    [42, 578, 42]
  );
  await waitTx('batchRegisterIdentity');

  const claimForAlice = {
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Some claim public data.")),
    issuer: claimIssuerContract.address,
    topic: claimTopics[0],
    scheme: 1,
    identity: aliceIdentity.address,
    signature: '',
  };
  claimForAlice.signature = await context.accounts.claimIssuerSigningKey.signMessage(
    ethers.utils.arrayify(
      ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes'],
          [claimForAlice.identity, claimForAlice.topic, claimForAlice.data],
        ),
      ),
    ),
  );

  await aliceIdentity.connect(context.accounts.aliceWallet).addClaim(
    claimForAlice.topic,
    claimForAlice.scheme,
    claimForAlice.issuer,
    claimForAlice.signature,
    claimForAlice.data,
    '',
  );
  await waitTx('aliceIdentity.addClaim');

  const claimForBob = {
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Some claim public data.")),
    issuer: claimIssuerContract.address,
    topic: claimTopics[0],
    scheme: 1,
    identity: bobIdentity.address,
    signature: '',
  };
  claimForBob.signature = await context.accounts.claimIssuerSigningKey.signMessage(
    ethers.utils.arrayify(
      ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes'],
          [claimForBob.identity, claimForBob.topic, claimForBob.data],
        ),
      ),
    ),
  );

  await bobIdentity.connect(context.accounts.bobWallet).addClaim(
    claimForBob.topic,
    claimForBob.scheme,
    claimForBob.issuer,
    claimForBob.signature,
    claimForBob.data,
    '',
  );
  await waitTx('bobIdentity.addClaim');

  await token.connect(context.accounts.tokenAgent).mint(context.accounts.aliceWallet.address, 1000);
  await waitTx('mint 1000');

  await token.connect(context.accounts.tokenAgent).mint(context.accounts.bobWallet.address, 500);
  await waitTx('mint 500');

  await agentManager.connect(context.accounts.tokenAgent).addAgentAdmin(
    context.accounts.tokenAdmin.address
  );
  await waitTx('addAgentAdmin');

  await token.connect(context.accounts.deployer).addAgent(agentManager.address);
  await waitTx('token.addAgent');

  await context.suite.identityRegistry.connect(context.accounts.deployer).addAgent(agentManager.address);
  await waitTx('identityRegistry.addAgent');

  await token.connect(context.accounts.tokenAgent).unpause();
  await waitTx('token.unpause');

  return {
    ...context,
    accounts: {
      ...context.accounts
    },
    identities: {
      aliceIdentity,
      bobIdentity,
      charlieIdentity
    },
    suite: {
      ...context.suite,
      claimIssuerContract,
      token,
      agentManager
    },
    authorities: {
      ...context.authorities
    },
    factories: {
      ...context.factories
    },
    implementations: {
      ...context.implementations
    },
  };
}

export async function deploySuiteWithModularCompliancesFixture(context: any) {
  const complianceProxy = await ethers.deployContract('ModularComplianceProxy', [context.authorities.trexImplementationAuthority.address]);
  await waitContractDeployment('ModularComplianceProxy', complianceProxy);

  const compliance = await ethers.getContractAt('ModularCompliance', complianceProxy.address);

  const complianceBeta = await ethers.deployContract('ModularCompliance');
  await waitContractDeployment('ModularCompliance', complianceBeta);

  await complianceBeta.init();
  await waitTx('complianceBeta.init()');

  return {
    ...context,
    suite: {
      ...context.suite,
      compliance,
      complianceBeta,
    },
  };
}

export async function deploySuiteWithModularCompliancesModulesFixture(context: any) {
  const complianceModuleA = await ethers.deployContract('CountryAllowModule');
  await waitContractDeployment('CountryAllowModule', complianceModuleA);

  await context.suite.complianceBeta.addModule(complianceModuleA.address);
  await waitTx('addModule(complianceModuleA.address)');

  const complianceModuleB = await ethers.deployContract('CountryAllowModule');
  await waitContractDeployment('CountryAllowModule', complianceModuleB);

  await context.suite.complianceBeta.addModule(complianceModuleB.address);
  await waitTx('addModule(complianceModuleB.address)');

  return {
    ...context,
    suite: {
      ...context.suite,
      complianceModuleA,
      complianceModuleB,
    },
  };
}

export const deployTrexEcosystemToSepolia = async (context: any) => {
  // setComplianceToTokenAndReturnComplianceBeta
  const txSetCompliance = await context.suite.token
    .connect(context.accounts.deployer)
    .setCompliance(context.suite.complianceBeta.address);
  await waitTx('txSetCompliance.setCompliance()');

  // allowCountryCode
  const txAllowCountryCodesModuleA = await context.suite.complianceBeta.callModuleFunction(
    new utils.Interface(['function batchAllowCountries(uint16[] countries)']).encodeFunctionData('batchAllowCountries', [[42, 578]]),
    context.suite.complianceModuleA.address
  );
  await waitTx('txAllowCountryCodesModuleA');

  const txAllowCountryCodesModuleB = await context.suite.complianceBeta.callModuleFunction(
    new utils.Interface(['function batchAllowCountries(uint16[] countries)']).encodeFunctionData('batchAllowCountries', [[42, 578]]),
    context.suite.complianceModuleB.address
  );
  await waitTx('txAllowCountryCodesModuleB');

  return context;
}

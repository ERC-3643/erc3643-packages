import { ContractFactory, Signer, ZeroAddress, keccak256, Interface, id, AbiCoder, hexlify, toUtf8Bytes, getBytes } from 'ethers';
import OnchainID from '@onchain-id/solidity';
import { ethers } from 'hardhat';

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

export async function deployIdentityProxy(implementationAuthority: string, managementKey: string, signer: Signer) {
  const identity = await new ContractFactory(
      OnchainID.contracts.IdentityProxy.abi,
      OnchainID.contracts.IdentityProxy.bytecode,
      signer
    ).deploy(
      implementationAuthority,
      managementKey
    );
  await waitContractDeployment('OnchainID.contracts.IdentityProxy.abi', identity);
  const identityContractAddress = await identity.getAddress();

  return ethers.getContractAt('Identity', identityContractAddress, signer);
}

export const deployImplementations = async () => {
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
  const identityImplementationAddress = await identityImplementation.getAddress();

  const identityImplementationAuthority = await new ethers.ContractFactory(
    OnchainID.contracts.ImplementationAuthority.abi,
    OnchainID.contracts.ImplementationAuthority.bytecode,
    deployer
  ).deploy(identityImplementationAddress);
  await waitContractDeployment('identityImplementationAuthority', identityImplementationAuthority);
  const identityImplementationAuthorityAddress = await identityImplementationAuthority.getAddress();

  const trexImplementationAuthority: any = await ethers.deployContract(
    'TREXImplementationAuthority',
    [true, ZeroAddress, ZeroAddress],
    deployer
  );
  await waitContractDeployment('TREXImplementationAuthority', trexImplementationAuthority);
  const trexImplementationAuthorityAddress = await trexImplementationAuthority.getAddress();

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

  const trexFactory = await ethers.deployContract('TREXFactory', [trexImplementationAuthorityAddress], deployer);
  await waitContractDeployment('TREXFactory', trexFactory, 60);

  const claimTopicsRegistryProxy = await ethers.deployContract('ClaimTopicsRegistryProxy', [trexImplementationAuthorityAddress], deployer);
  await waitContractDeployment('ClaimTopicsRegistryProxy', claimTopicsRegistryProxy);
  const claimTopicsRegistryProxyAddress = await claimTopicsRegistryProxy.getAddress();
  const claimTopicsRegistry = await ethers.getContractAt('ClaimTopicsRegistry', claimTopicsRegistryProxyAddress);

  const trustedIssuersRegistryProxy = await ethers.deployContract('TrustedIssuersRegistryProxy', [trexImplementationAuthorityAddress], deployer);
  await waitContractDeployment('TrustedIssuersRegistryProxy', trustedIssuersRegistryProxy);
  const trustedIssuersRegistryProxyAddress = await trustedIssuersRegistryProxy.getAddress();
  const trustedIssuersRegistry = await ethers.getContractAt('TrustedIssuersRegistry', trustedIssuersRegistryProxyAddress);

  const identityRegistryStorageProxy = await ethers.deployContract('IdentityRegistryStorageProxy', [trexImplementationAuthority.address], deployer);
  await waitContractDeployment('IdentityRegistryStorageProxy', identityRegistryStorageProxy);
  const identityRegistryStorageProxyAddress = await identityRegistryStorageProxy.getAddress();
  const identityRegistryStorage = await ethers.getContractAt('IdentityRegistryStorage', identityRegistryStorageProxyAddress);

  const defaultCompliance = await ethers.deployContract('DefaultCompliance', deployer);
  await waitContractDeployment('DefaultCompliance', defaultCompliance);

  const identityRegistryProxy = await ethers
    .deployContract(
      'IdentityRegistryProxy',
      [trexImplementationAuthorityAddress, trustedIssuersRegistry.address, claimTopicsRegistry.address, identityRegistryStorage.address],
      deployer,
    );
  await waitContractDeployment('IdentityRegistryProxy', identityRegistryProxy);
  const identityRegistryProxyAddress = await identityRegistryProxy.getAddress();
  const identityRegistry = await ethers.getContractAt('IdentityRegistry', identityRegistryProxyAddress);

  const tokenOID = await deployIdentityProxy(identityImplementationAuthorityAddress, tokenIssuer.address, deployer);

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
  const tokenDecimals = BigInt('0');
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
  const tokenProxyAddress = await tokenProxy.getAddress();
  const token: any = await ethers.getContractAt('Token', tokenProxyAddress);

  const agentManager: any = await ethers.deployContract('AgentManager', [token.address], context.accounts.tokenAgent);
  await waitContractDeployment('AgentManager', agentManager);

  await context.suite.identityRegistryStorage.connect(context.accounts.deployer).bindIdentityRegistry(context.suite.identityRegistry.address);
  await waitTx('bindIdentityRegistry');

  await token.connect(context.accounts.deployer).addAgent(context.accounts.tokenAgent.address);
  await waitTx('addAgent(tokenAgent.address)');

  const claimTopics = [id('CLAIM_TOPIC')];
  await context.suite.claimTopicsRegistry.connect(context.accounts.deployer).addClaimTopic(claimTopics[0]);
  await waitTx('addClaimTopic');

  const claimIssuerContract: any = await ethers.deployContract('ClaimIssuer', [context.accounts.claimIssuer.address], context.accounts.claimIssuer);
  await waitContractDeployment('ClaimIssuer', claimIssuerContract);

  await claimIssuerContract
    .connect(context.accounts.claimIssuer)
    .addKey(keccak256(AbiCoder.defaultAbiCoder().encode(['address'], [context.accounts.claimIssuerSigningKey.address])), 3, 1);
  await waitTx('claimIssuer.addKey');

  await context.suite.trustedIssuersRegistry.connect(context.accounts.deployer).addTrustedIssuer(claimIssuerContract.address, claimTopics);
  await waitTx('addTrustedIssuer');

  const aliceIdentity: any = await deployIdentityProxy(context.authorities.identityImplementationAuthority.address, context.accounts.aliceWallet.address, context.accounts.deployer);
  await aliceIdentity.connect(context.accounts.aliceWallet).addKey(
    keccak256(AbiCoder.defaultAbiCoder().encode(['address'], [context.accounts.aliceActionKey.address])),
    2,
    1
  );
  await waitTx('aliceIdentity.addKey');

  const bobIdentity: any = await deployIdentityProxy(context.authorities.identityImplementationAuthority.address, context.accounts.bobWallet.address, context.accounts.deployer);
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
    data: hexlify(toUtf8Bytes("Some claim public data.")),
    issuer: claimIssuerContract.address,
    topic: claimTopics[0],
    scheme: 1,
    identity: aliceIdentity.address,
    signature: '',
  };
  claimForAlice.signature = await context.accounts.claimIssuerSigningKey.signMessage(
    getBytes(
      keccak256(
        AbiCoder.defaultAbiCoder().encode(
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
    data: hexlify(toUtf8Bytes("Some claim public data.")),
    issuer: claimIssuerContract.address,
    topic: claimTopics[0],
    scheme: 1,
    identity: bobIdentity.address,
    signature: '',
  };
  claimForBob.signature = await context.accounts.claimIssuerSigningKey.signMessage(
    getBytes(
      keccak256(
        AbiCoder.defaultAbiCoder().encode(
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
  const complianceProxyAddress = await complianceProxy.getAddress();

  const compliance = await ethers.getContractAt('ModularCompliance', complianceProxyAddress);

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
  const moduleAtx = await context.suite.complianceBeta.addModule(complianceModuleA.address);
  await moduleAtx.wait();

  const complianceModuleB = await ethers.deployContract('CountryAllowModule');
  const moduleBtx = await context.suite.complianceBeta.addModule(complianceModuleB.address);
  await moduleBtx.wait();

  return {
    ...context,
    suite: {
      ...context.suite,
      complianceModuleA,
      complianceModuleB,
    },
  };
}

export const registerCharlieIdentity = async (context: any) => {
  const registerIdentityTx = await context.suite.identityRegistry.connect(context.accounts.tokenAgent)
    .batchRegisterIdentity(
      [context.accounts.charlieWallet.address],
      [context.identities.charlieIdentity.address],
      [42]
    );
  await registerIdentityTx.wait();
}

export const setComplianceAndAllowCountryCodes = async (context: any) => {
  // setComplianceToTokenAndReturnComplianceBeta
  const txSetCompliance = await context.suite.token
    .connect(context.accounts.deployer)
    .setCompliance(context.suite.complianceBeta.address);
  await txSetCompliance.wait();

  // allowCountryCode
  const txAllowCountryCodesModuleA = await context.suite.complianceBeta.callModuleFunction(
    new Interface(['function batchAllowCountries(uint16[] countries)']).encodeFunctionData('batchAllowCountries', [[42, 578, 666]]),
    context.suite.complianceModuleA.address
  );
  await txAllowCountryCodesModuleA.wait();

  const txAllowCountryCodesModuleB = await context.suite.complianceBeta.callModuleFunction(
    new Interface(['function batchAllowCountries(uint16[] countries)']).encodeFunctionData('batchAllowCountries', [[42, 578, 666]]),
    context.suite.complianceModuleB.address
  );
  await txAllowCountryCodesModuleB.wait();

  return context;
}

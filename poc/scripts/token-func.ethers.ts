import { JsonRpcProvider } from 'ethers';

import {
  getTokenContract,
  getIdentityRegistryContract
} from './setup';
import { getSigners } from './signers';
import { verifyAllIdentities } from './verify-eligibility';
import { showTokenInfo } from './token-info';
import { pausable } from './pausable';
import { transferTokens } from './transfer-tokens';
import { freezeTokens } from './freeze-tokens';
import { freezeUnfreezeWallet } from './freeze-unfreeze-wallet';
import { checkCompliance } from './check-compliance';

const checkUseCases = async () => {
  const rpc = new JsonRpcProvider('http://localhost:8545');

  const {
    deployer,
    tokenAgent,
    aliceWallet,
    claimIssuer,
    bobWallet,
    charlieWallet,
    anotherWallet10
  } = getSigners(rpc);

  const token = getTokenContract(tokenAgent);
  const identityRegistry = await getIdentityRegistryContract(token, tokenAgent);

  await showTokenInfo(token);

  await pausable(token);
  
  await transferTokens(token, aliceWallet, bobWallet);

  await freezeTokens(token, bobWallet);

  await freezeUnfreezeWallet(token, anotherWallet10);

  await checkCompliance(token, deployer, identityRegistry, aliceWallet, bobWallet);

  await verifyAllIdentities(identityRegistry, aliceWallet, bobWallet, charlieWallet, claimIssuer, deployer);
}

checkUseCases();

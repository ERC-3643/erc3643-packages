import { ref } from 'vue';
import { Signer } from 'vue-dapp';
import { getToken } from '@erc-3643/core';

export async function useToken(tokenAddress: string, signer: Signer, debug = false) {

  const owner = ref('');
  const name = ref('');
  const totalSupply = ref<bigint>(BigInt(0));
  const decimals = ref<bigint>(BigInt(0));
  const frozenTokens = ref<bigint>(BigInt(0));
  const realBalanceOf = ref<bigint>(BigInt(0));
  const balanceOf = ref<bigint>(BigInt(0));
  const paused = ref(false);
  const walletIsFrozen = ref(false);

  const {
    contract,
    tokenOwner,
    tokenName,
    tokenTotalSupply,
    tokenDecimals,
    tokenPaused,
    tokenBalanceOf,
    tokenFrozenTokens,
    tokenRealBalanceOf,
    tokenWalletIsFrozen,
    tokenRun,
    tokenPause,
    tokenFreeze,
    tokenUnfreeze,
    identityRegistry
  } = await getToken(tokenAddress, signer);

  owner.value = tokenOwner;
  name.value = tokenName;
  totalSupply.value = tokenTotalSupply;
  decimals.value = tokenDecimals;
  paused.value = tokenPaused;
  balanceOf.value = tokenBalanceOf;
  frozenTokens.value = tokenFrozenTokens;
  realBalanceOf.value = tokenRealBalanceOf as any;
  walletIsFrozen.value = tokenWalletIsFrozen;

  contract.on('Paused', () => {
    paused.value = true;
  });

  contract.on('Unpaused', () => {
    paused.value = false;
  });

  contract.on('AddressFrozen', (walletAddressToFreeze: string, isFrozen: boolean, signerAddress: string) => {
    console.log(walletAddressToFreeze, 'is frozen', isFrozen);
  });

  contract.on('error', (error: Error) => {
    console.log(error);
  })

  signer.provider?.on('debug', (data: any) => {
    if (debug) {
      console.log(...data);
    }
  });

  return {
    owner,
    name,
    totalSupply,
    decimals,
    frozenTokens,
    realBalanceOf,
    balanceOf,
    paused,
    walletIsFrozen,
    pause: tokenPause,
    run: tokenRun,
    unfreeze: tokenFreeze,
    freeze: tokenUnfreeze,
    identityRegistry
  }
}
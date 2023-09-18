import { ref } from 'vue';
import { Signer } from 'vue-dapp';
import { getToken } from '@erc-3643/core';

export async function useToken(tokenAddress: string, signer: Signer, debug = false) {

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
    identityRegistry,
    compliance,
    isWalletFrozen,
    getFrozenTokens,
    getBalance,
    areTransferPartiesFrozen,
    isEnoughSpendableBalance
  } = await getToken(tokenAddress, signer);

  const paused = ref(false);
  paused.value = tokenPaused;

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
    owner: tokenOwner,
    name: tokenName,
    totalSupply: tokenTotalSupply,
    decimals: tokenDecimals,
    balanceOf: tokenBalanceOf,
    frozenTokens: tokenFrozenTokens,
    realBalanceOf: tokenRealBalanceOf,
    walletIsFrozen: tokenWalletIsFrozen,
    paused,
    pause: tokenPause,
    run: tokenRun,
    unfreeze: tokenFreeze,
    freeze: tokenUnfreeze,
    identityRegistry,
    compliance,
    isWalletFrozen,
    getFrozenTokens,
    getBalance,
    areTransferPartiesFrozen,
    isEnoughSpendableBalance
  };
}

import 'reflect-metadata';
import { ref } from 'vue';
import { Signer } from 'vue-dapp';
import { TokenContract } from '@erc-3643/core';

export async function useToken(tokenAddress: string, signer: Signer) {

  const token = TokenContract.init(tokenAddress, signer);

  const isPaused = ref(false);
  isPaused.value = await token.paused();

  token.contract.on('Paused', () => {
    isPaused.value = true;
  });

  token.contract.on('Unpaused', () => {
    isPaused.value = false;
  });

  token.contract.on('AddressFrozen', (walletAddressToFreeze: string, isFrozen: boolean, signerAddress: string) => {
    console.log(walletAddressToFreeze, 'is frozen', isFrozen);
  });

  token.contract.on('error', (error: Error) => {
    console.log(error);
  })

  return {
    token,
    isPaused
  };
}

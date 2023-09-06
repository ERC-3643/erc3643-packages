import { contracts } from '@tokenysolutions/t-rex';
import { Contract, Signer } from 'ethers';
import { Ref, ref, watch } from 'vue';
import { useEthers, useWallet } from 'vue-dapp';
const { address: walletAddress, signer } = useEthers()
// const { wallet } = useWallet()

export function useToken(tokenAddress: string) {

  const owner = ref('');
  const name = ref('');
  const errorMessage = ref('');
  const totalSupply = ref<bigint>(BigInt(0));
  const decimals = ref<bigint>(BigInt(0));
  const frozenTokens = ref<bigint>(BigInt(0));
  const realBalanceOf = ref<bigint>(BigInt(0));
  const balanceOf = ref<bigint>(BigInt(0));
  const paused = ref(false);
  const walletIsFrozen = ref(false);
  const pause = ref<() => void>(() => {});
  const run = ref<() => void>(() => {});
  const unfreeze = ref<(address: string) => void>(() => {});
  const freeze = ref<(address: string) => void>(() => {});

  watch(signer, async (value: Ref<Signer | null>) => {
    if (value) {
      const tokenContract = new Contract(
        tokenAddress,
        contracts.Token.abi
      );

      const token: any = tokenContract.connect(signer.value as Signer);

      owner.value = await token.owner();
      name.value = await token.name();
      totalSupply.value = await token.totalSupply();
      decimals.value = await token.decimals();
      balanceOf.value = await token.balanceOf(
        walletAddress.value
      );
      paused.value = await token.paused();
      frozenTokens.value = await token.getFrozenTokens(walletAddress.value);
      realBalanceOf.value = balanceOf.value - frozenTokens.value;
      walletIsFrozen.value = await token.isFrozen(walletAddress.value);

      unfreeze.value = async (address: string) => {
        console.log(address)
        const freezeWallet = await token.setAddressFrozen(address, false);
        await freezeWallet.wait();
      }

      freeze.value = async (address: string) => {
        const unfreezeWallet = await token.setAddressFrozen(address, true);
        await unfreezeWallet.wait();
      }

      pause.value = async () => {
        const pause = await token.pause();
        await pause.wait();
      }

      run.value = async () => {
        const unpause = await token.unpause();
        await unpause.wait();
      }

      token.on('Paused', () => {
        paused.value = true;
      });

      token.on('Unpaused', () => {
        paused.value = false;
      });

      token.on('AddressFrozen', (walletAddressToFreeze: string, isFrozen: boolean, signerAddress: string) => {
        console.log(walletAddressToFreeze, 'is frozen', isFrozen);
      });

      token.on('error', (error: Error) => {
        console.log(error);
      })


      // signer.value?.provider?.on('debug', ({ error, ...rest }: any) => {

      //   if (error) {
      //     errorMessage.value = error.data.message;
      //   }
      // });

    }

  });

  return {
    owner,
    name,
    totalSupply,
    decimals,
    balanceOf,
    paused,
    frozenTokens,
    realBalanceOf,
    walletIsFrozen,
    unfreeze,
    freeze,
    pause,
    run
  }
}
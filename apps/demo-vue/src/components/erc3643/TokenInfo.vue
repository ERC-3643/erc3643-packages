<script setup lang="ts">
import { useToken } from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { TOKEN_ADDRESS } from '@/constants';

const { signer } = useEthers()

const tokenData = ref<{ [key: string]: any }>({});

watch(signer, async (signer) => {
  if (signer) {
    const {
      token,
      isPaused
    } = await useToken(TOKEN_ADDRESS, signer);
    tokenData.value.decimals = await token.decimals()
    tokenData.value.name = await token.name()
    tokenData.value.owner = await token.owner()
    tokenData.value.totalSupply = await token.totalSupply()
    tokenData.value.balanceOf = await token.balanceOf()
    tokenData.value.frozenTokens = await token.frozenTokens()
    tokenData.value.realBalanceOf = await token.realBalanceOf()
    tokenData.value.isPaused = isPaused;
    tokenData.value.walletIsFrozen = await token.walletIsFrozen(await signer.getAddress())
  }
})


</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="token-info">
      <q-card-section>
        <div class="text-h6">Token info:</div>
      </q-card-section>
      <q-card-section>
        <p>Decimals: {{ tokenData.decimals }}</p>
        <p>Name: {{ tokenData.name }}</p>
        <p>Owner: {{ tokenData.owner }}</p>
        <p>Total Supply: {{ tokenData.totalSupply }}</p>
        <p>Balance Of: {{ tokenData.balanceOf }}</p>
        <p>Frozen Tokens: {{ tokenData.frozenTokens }}</p>
        <p>Real Balance Of: {{ tokenData.realBalanceOf }}</p>
        <p>
          Wallet Is Frozen: {{  }}
          <q-chip v-if="tokenData.walletIsFrozen" color="negative" text-color="white">
            Yes
          </q-chip>
          <q-chip v-else color="positive" text-color="white">
            No
          </q-chip>
        </p>
        <p>
          Token Is Paused:
          <q-chip v-if="tokenData.isPaused" color="negative" text-color="white">
            Yes
          </q-chip>
          <q-chip v-else color="positive" text-color="white">
            No
          </q-chip>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

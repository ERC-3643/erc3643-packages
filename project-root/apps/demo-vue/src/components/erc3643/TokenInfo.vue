<script setup lang="ts">
import { useToken } from '@erc-3643/vue-usedapp'
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';

const { signer } = useEthers()

const token = ref<{ [key: string]: any }>({});

watch(signer, (signer) => {
  if (signer) {
    token.value = useToken('0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE', signer);
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
        <p>Decimals: {{ token.decimals }}</p>
        <p>Name: {{ token.name }}</p>
        <p>Owner: {{ token.owner }}</p>
        <p>Total Supply: {{ token.totalSupply}}</p>
        <p>Balance Of: {{ token.balanceOf }}</p>
        <p>Frozen Tokens: {{ token.frozenTokens }}</p>
        <p>Real Balance Of: {{ token.realBalanceOf }}</p>
        <p>
          Wallet Is Frozen: {{ token.walletIsFrozen }}
        </p>
        <p>
          Token Is Paused: {{ token.paused }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

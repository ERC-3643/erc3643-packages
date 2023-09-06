<script setup lang="ts">
import { ref } from 'vue'
import { useToken } from '@/composables'

const {
  balanceOf,
  decimals,
  name,
  owner,
  totalSupply,
  paused,
  frozenTokens,
  realBalanceOf,
  walletIsFrozen
} = useToken('0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE');

</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="token-info">
      <q-card-section>
        <div class="text-h6">Token info:</div>
      </q-card-section>
      <q-card-section>
        <p>Decimals: {{ decimals }}</p>
        <p>Name: {{ name }}</p>
        <p>Owner: {{ owner }}</p>
        <p>Total Supply: {{ totalSupply}}</p>
        <p>Balance Of: {{ balanceOf }}</p>
        <p>Frozen Tokens: {{ frozenTokens }}</p>
        <p>Real Balance Of: {{ realBalanceOf }}</p>
        <p>
          Wallet Is Frozen: {{ walletIsFrozen }}
        </p>
        <p>
          Token Is Paused: {{ paused }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

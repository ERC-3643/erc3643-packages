<script setup lang="ts">
import { ref } from 'vue';
import { useToken } from './../../composables'

const {
  paused,
  unfreeze,
  freeze,
  pause,
  run
} = useToken('0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE');

const BOB_WALLET = '0x976EA74026E726554dB657fA54763abd0C3a0aa9'

const addressFreeze = ref<string | null>(null);
const addressUnfreeze = ref<string | null>(null);

const walletFreeze = () => {
  console.log(addressFreeze.value)
  if (addressFreeze.value) {
    freeze.value(addressFreeze.value)
  }
}

const walletUnfreeze = () => {
  console.log(addressUnfreeze.value)
  if (addressUnfreeze.value) {
    unfreeze.value(addressUnfreeze.value)
  }
}
</script>
<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="token-info">
      <q-card-section>
        <div class="text-h6">Token actions:</div>
      </q-card-section>
      <q-card-section>
        <p>
          Pause token:
          <q-btn v-if="paused" color="positive" @click="run" label="Run" dense />
          <q-btn v-else color="negative" @click="pause" label="Pause" dense />
        </p>
        <p>
          <q-input
            v-model="addressUnfreeze"
            label="Wallet address to freeze"
            :hint="`ex. Bob wallet ${BOB_WALLET}`"
            dense
          />
          <q-btn class="btn" @click="walletUnfreeze" label="Unfreeze Wallet" dense />
        </p>
        <p>
          <q-input
            v-model="addressFreeze"
            label="Wallet address to unfreeze"
            :hint="`ex. Bob wallet ${BOB_WALLET}`"
            dense
          />
          <q-btn class="btn" @click="walletFreeze" label="Freeze Wallet"/>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>
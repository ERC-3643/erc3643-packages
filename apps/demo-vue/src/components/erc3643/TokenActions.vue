<script setup lang="ts">
import { useToken } from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { BOB_WALLET, TOKEN_ADDRESS } from '@/constants';

const { signer } = useEthers();

const tokenData = ref<{ [key: string]: any }>({});


watch(signer, async (signer) => {
  if (signer) {
    const { token, isPaused } = await useToken(TOKEN_ADDRESS, signer);

    tokenData.value = token;
    tokenData.value.isPaused = isPaused;
  }
})

const addressFreeze = ref<string | null>(null);
const addressUnfreeze = ref<string | null>(null);

const walletFreeze = () => {
  if (addressFreeze.value) {
    tokenData.value.freeze(addressFreeze.value);
  }
}

const walletUnfreeze = () => {
  if (addressUnfreeze.value) {
    tokenData.value.unfreeze(addressUnfreeze.value);
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
          <q-btn v-if="tokenData.isPaused" color="positive" @click="tokenData.run" label="Run" dense />
          <q-btn v-else color="negative" @click="tokenData.pause" label="Pause" dense />
        </p>
        <p>
          <q-input
            v-model="addressFreeze"
            label="Wallet address to freeze"
            :hint="`ex. Bob wallet ${BOB_WALLET}`"
            dense
          />
          <q-btn color="secondary" @click="walletFreeze" label="Freeze Wallet" dense />
        </p>
        <p>
          <q-input
            v-model="addressUnfreeze"
            label="Wallet address to unfreeze"
            :hint="`ex. Bob wallet ${BOB_WALLET}`"
            dense
          />
          <q-btn color="warning" @click="walletUnfreeze" label="Unfreeze Wallet" dense />
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>
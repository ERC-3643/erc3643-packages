<script setup lang="ts">
import { ref } from 'vue';
import { useBoard, useEthers, useWallet, displayEther, shortenAddress } from 'vue-dapp'
const { open } = useBoard()
const { address, balance, isActivated } = useEthers()
const { disconnect, wallet } = useWallet()

const connectButton = ref('Connect');

connectButton.value = wallet.status === 'connecting'
              ? 'Connecting...'
              : wallet.status === 'loading'
              ? 'Loading...'
              : 'Connect'
</script>
<template>
      <q-chip
        v-if="isActivated"
        outline
        color="orange"
        text-color="white"
        >
        {{ shortenAddress(address) }}
      </q-chip>
      <q-chip
      v-if="isActivated"
        outline
        color="orange"
        text-color="white"
        >
        {{ displayEther(balance) }} ETH
      </q-chip>
      <q-btn
        v-if="isActivated"
        label="Disconnect"
        color="deep-orange"
        @click="disconnect"
      />
      <q-btn
        v-if="!isActivated"
        color="secondary"
        @click="open()"
        :disabled="wallet.status === 'connecting'"
        :label="connectButton"
      />
</template>

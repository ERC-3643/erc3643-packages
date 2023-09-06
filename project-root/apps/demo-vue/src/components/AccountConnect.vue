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
  <q-list>
      <q-item v-if="isActivated">
        <q-btn
          label="Disconnect"
          color="deep-orange"
          @click="disconnect"
        />
      </q-item>
      <q-item v-else  >
        <q-btn
          color="secondary"
          @click="open()"
          :disabled="wallet.status === 'connecting'"
          :label="connectButton"
        />
      </q-item>
      <q-item v-if="isActivated">
        <q-chip outline color="orange" text-color="white">
          {{ shortenAddress(address) }}
        </q-chip>
        <p></p>
        <q-chip outline color="orange" text-color="white">
          {{ displayEther(balance) }} ETH
        </q-chip>
      </q-item>
  </q-list>
</template>

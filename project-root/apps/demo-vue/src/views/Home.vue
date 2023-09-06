<script setup lang="ts">
import TokenInfo from '@/components/erc3643/TokenInfo.vue'
import Erc3642Actions from '@/components/erc3643/Erc3642Actions.vue'
</script>

<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm q-py-sm">
      <TokenInfo />
      <Erc3642Actions />
    </div>
  </q-page>
</template>

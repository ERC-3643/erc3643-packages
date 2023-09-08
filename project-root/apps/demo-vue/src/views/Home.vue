<script setup lang="ts">
import TokenInfo from '@/components/erc3643/TokenInfo.vue'
import TokenActions from '@/components/erc3643/TokenActions.vue'
import ComplianceInfo from '@/components/erc3643/ComplianceInfo.vue'
import IdentityRegistryInfo from '@/components/erc3643/IdentityRegistryInfo.vue'
import EligibilityVerification from '@/components/erc3643/EligibilityVerification.vue'
</script>

<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm q-py-sm">
      <TokenInfo />
      <TokenActions />
    </div>
    <div class="row q-col-gutter-sm q-py-sm">
      <IdentityRegistryInfo />
    </div>
    <div class="row q-col-gutter-sm q-py-sm">
      <ComplianceInfo />
    </div>
    <div class="row q-col-gutter-sm q-py-sm">
      <EligibilityVerification />
    </div>
  </q-page>
</template>

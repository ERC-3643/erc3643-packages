<script setup lang="ts">
import { useIdentityRegistry, useToken } from '@erc-3643/vue-usedapp'
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { TOKEN_ADDRESS } from '@/constants'

const { signer } = useEthers()

const token = ref<{ [key: string]: any }>({});
const investorCountry = ref(0);
watch(signer, async (signer) => {
  if (signer) {
    token.value = await useToken(TOKEN_ADDRESS, signer);
    const identityRegistryAddress = await token.value.identityRegistry();
    const {
      getInvestorCountry
    } = await useIdentityRegistry(identityRegistryAddress, signer);

    investorCountry.value = await getInvestorCountry(await signer.getAddress());
  }
})


</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="identity-registry-info">
      <q-card-section>
        <div class="text-h6">Identity Registry info:</div>
      </q-card-section>
      <q-card-section>
        <p>Investor Country: {{ investorCountry }}</p>
      </q-card-section>
    </q-card>
  </div>
</template>

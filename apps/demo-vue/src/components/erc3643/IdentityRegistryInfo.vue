<script setup lang="ts">
import { useIdentityRegistry, useToken } from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { TOKEN_ADDRESS } from '@/constants';

const { signer } = useEthers();

const investorCountry = ref(0);
const identityRegistryAddress = ref('');
watch(signer, async (signer) => {
  if (signer) {
    const { token } = await useToken(TOKEN_ADDRESS, signer);

    identityRegistryAddress.value = await token.identityRegistry();
    const identityRegistry = useIdentityRegistry(identityRegistryAddress.value, signer);

    investorCountry.value = await identityRegistry.getInvestorCountry(await signer.getAddress());
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
        <p>Identity Registry: {{ identityRegistryAddress }}</p>
      </q-card-section>
      <q-card-section>
        <p>Investor Country: {{ investorCountry }}</p>
      </q-card-section>
    </q-card>
  </div>
</template>

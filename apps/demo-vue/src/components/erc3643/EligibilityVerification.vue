<script setup lang="ts">
import {
  useToken,
  useEligibilityVerification
} from '@erc-3643/vue-usedapp'
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { TOKEN_ADDRESS } from '@/constants'

const { signer } = useEthers()
const result = ref<any>({});

watch(signer, async (signer) => {

  if (signer) {
    const token = await useToken(TOKEN_ADDRESS, signer);
    const identityRegistryAddress = await token.identityRegistry();

    result.value = await useEligibilityVerification(identityRegistryAddress, signer);
  }
});

</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="eligibility-verification-info">
      <q-card-section>
        <div class="text-h6">Eligibility Verification:</div>
      </q-card-section>
      <q-card-section>
        <p>Identity Is Verified:
          <q-chip v-if="result.identityIsVerified" color="positive" text-color="white">
            Yes
          </q-chip>
          <q-chip v-else color="negative" text-color="white">
            No
          </q-chip>
        </p>
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="height: 230px;" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <p>Missing Claim Topics:</p>
          <div class="row no-wrap">
            <pre>{{ result.missingClaimTopics }}</pre>
          </div>
          <p>Invalid Claims:</p>
          <div class="row no-wrap">
            <pre class="col-lg-12 col-md-12 col-sm-12 col-xs-12">{{ result.invalidClaims }}</pre>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

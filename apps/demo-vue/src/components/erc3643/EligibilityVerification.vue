<script setup lang="ts">
import {
  useIdentityRegistry,
  useToken,
  useClaimTopicsRegistry,
  useOnchainIDIdentity,
  useClaimIssuer
} from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { TOKEN_ADDRESS, ZERO_ADDRESS } from '@/constants';

const { signer } = useEthers();
const identityIsVerified = ref(null);
const missingClaimTopics = ref<any>([]);
const invalidClaims = ref<any>([]);

watch(signer, async (signer) => {
  if (signer) {
    const signerAddress = await signer.getAddress();
    const token = await useToken(TOKEN_ADDRESS, signer);
    const identityRegistryAddress = await token.identityRegistry();
    const {
      isVerified,
      identity,
      topicsRegistry
    } = useIdentityRegistry(identityRegistryAddress, signer);

    identityIsVerified.value = await isVerified(signerAddress);

    if (!identityIsVerified.value) {
      const identityAddress = await identity(signerAddress);

      if (identityAddress === ZERO_ADDRESS) {
        console.log(`There is no OnChainID associated with address ${signerAddress}`);
      } else {
        const topicsRegistryAddress = await topicsRegistry();

        const {
          getClaimTopics
        } = useClaimTopicsRegistry(
          topicsRegistryAddress,
          signer
        );

        const {
          getClaim,
          getClaimIdsByTopic
        } = useOnchainIDIdentity(identityAddress, signer);

        const claimTopics = await getClaimTopics();

        missingClaimTopics.value = [];
        invalidClaims.value = [];

        for (const topic of claimTopics) {
          const claimIds = await getClaimIdsByTopic(topic);

          !claimIds.length && missingClaimTopics.value.push(topic);

          for (const claimId of claimIds) {
            const claim = await getClaim(claimId);

            const {
              isClaimValid
            } = useClaimIssuer(claim.issuer, signer);

            const isValid = await isClaimValid(
              identityAddress,
              topic,
              claim.signature,
              claim.data
            );

            !isValid && invalidClaims.value.push(claim);
          }
        }
      }
    }
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
          <q-chip v-if="identityIsVerified" color="positive" text-color="white">
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
            <pre>{{ missingClaimTopics }}</pre>
          </div>
          <p>Invalid Claims:</p>
          <div class="row no-wrap">
            <pre class="col-lg-12 col-md-12 col-sm-12 col-xs-12">{{ invalidClaims }}</pre>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

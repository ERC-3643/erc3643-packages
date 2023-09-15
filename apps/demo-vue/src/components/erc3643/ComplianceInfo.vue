<script setup lang="ts">
import { useCompliance, useTransferCompliance } from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { Signer } from 'ethers';
import { useEthers } from 'vue-dapp';
import { BOB_WALLET, COMPLIANCE_ADDRESS, TOKEN_ADDRESS } from '@/constants';

const { signer } = useEthers();

const compliance = ref<{ [key: string]: any }>({});
const signerAddress = ref('');
const addressToTransfer = ref('');
const amountToTransfer = ref(0);
const transferOk = ref(null);
const complianceErrors = ref([]);


watch(signer, async (signer) => {
  if (signer) {
    compliance.value = useCompliance(COMPLIANCE_ADDRESS, signer);
    signerAddress.value = await signer.getAddress()
  }
});

const canTransfer = async () => {
  // TODO: Use Provider (e.g. ethers.providers.Web3Provider) when you intend to read state
  // Use Signer only when you intend to change state
  // const provider = new providers.Web3Provider((window as any).ethereum, 'any');
  const { isTransferCompliant } = useTransferCompliance();
  try {
    await isTransferCompliant(
      signer.value as Signer,
      TOKEN_ADDRESS,
      signerAddress.value,
      addressToTransfer.value,
      amountToTransfer.value
    );

    transferOk.value = true as any;
  } catch (e) {
    complianceErrors.value = (e as any).cause;
    transferOk.value = false as any;
  }
}
</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <div class="row q-col-gutter-sm q-py-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="compliance-info">
          <q-card-section>
            <div class="text-h6">Compliance Info:</div>
          </q-card-section>
          <q-card-section>
            <p>
              Can transfer?
              <q-chip v-if="transferOk" color="positive" text-color="white">
                Yes
              </q-chip>
              <q-chip v-else color="negative" text-color="white">
                No
              </q-chip>
            </p>
            <p>
              From: {{ signerAddress }}
            </p>
            <p>
              <q-input
                v-model="addressToTransfer"
                label="Transfer to wallet"
                :hint="`ex. Bob wallet ${BOB_WALLET}`"
                dense
              />
            </p>
            <p>
              <q-input
                v-model="amountToTransfer"
                label="Amount of tokens"
                dense
              />
            </p>
            <p>
              <q-btn color="primary" @click="canTransfer" label="Can transfer?" dense />
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-sm q-py-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="compliance-errors" style="display: block;" v-if="transferOk == false">
          <q-card-section>
            <div class="text-h6">Compliance Errors:</div>
          </q-card-section>
          <div
            v-for="(error, index) in complianceErrors"
            :key="index"
          >
            <q-card-section :class="[index === 0 ? 'q-pt-none': '']">
              <q-chip style="height: 100%;" color="negative" text-color="white">
                <div style="white-space: normal; word-wrap: break-word;">
                  {{ error }}
                </div>
              </q-chip>
            </q-card-section>
            <q-separator inset />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>
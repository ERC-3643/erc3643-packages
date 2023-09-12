<script setup lang="ts">
import { useCompliance, useComplianceModule } from '@erc-3643/vue-usedapp'
import { ref, watch } from 'vue';
import { Signer, useEthers } from 'vue-dapp';
import { contracts } from '@tokenysolutions/t-rex';
import { BOB_WALLET, COMPLIANCE_ADDRESS } from '@/constants';

const { signer } = useEthers();

const contractNamesMapper: { [key: string]: string } = {
  '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB': contracts.CountryAllowModule.contractName,
  '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9': contracts.CountryAllowModule.contractName
};

const compliance = ref<{ [key: string]: any }>({});
const signerAddress = ref('');
const addressToTransfer = ref('');
const amountToTransfer = ref(0);
const transferOk = ref(null);
const modules = ref<{ [key: string]: any }>([]);


watch(signer, async (signer) => {
  if (signer) {
    compliance.value = await useCompliance(COMPLIANCE_ADDRESS, signer);
    signerAddress.value = await signer.getAddress()
  }
});

const canTransfer = async () => {
  transferOk.value = await compliance.value.canTransfer(
    signerAddress.value,
    addressToTransfer.value,
    amountToTransfer.value
  );

  if (transferOk.value === false) {
    const modulesAddresses = await compliance.value.getModules();

    for (const address of modulesAddresses) {

      const {
        moduleCheck
      } = useComplianceModule(
        address,
        contracts.CountryAllowModule.abi,
        signer.value as Signer
      );

      modules.value.push({
        address,
        name: contractNamesMapper[address],
        status: await moduleCheck(
          signerAddress.value,
          addressToTransfer.value,
          amountToTransfer.value,
          COMPLIANCE_ADDRESS
        )
      })
    }
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
        <q-card class="compliance-modules" v-if="transferOk == false">
          <q-card-section>
            <div class="text-h6">Compliance Modules:</div>
          </q-card-section>
          <div
            v-for="(m, index) in modules"
            :key="m.address"
          >
            <q-card-section :class="[index === 0 ? 'q-pt-none': '']">
              {{ m.address }}<br/>{{ m.name }}
              <q-chip v-if="m.status" color="positive" text-color="white">
                Allow
              </q-chip>
              <q-chip v-else color="negative" text-color="white">
                Restrict
              </q-chip>
            </q-card-section>
            <q-separator inset />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>
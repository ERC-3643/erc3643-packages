# @erc-3643/vue-usedapp

![Build Status](https://github.com/ERC-3643/erc3643-packages/actions/workflows/push-checking.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@erc-3643%2Fvue-usedapp.svg)](https://badge.fury.io/js/@erc-3643%2Fvue-usedapp)
[![NPM Downloads](https://img.shields.io/npm/dt/@erc-3643%2Fvue-usedapp.svg)](https://www.npmjs.com/package/@erc-3643%2Fvue-usedapp)

## Table of contents
- [What is @erc-3643/vue-usedapp](#what-is-erc-3643vue-usedapp-⬆)
- [Installation](#installation-⬆)
- [Usage examples](#usage-examples-⬆)
  - [Token API](#token-api-⬆)
  - [Transfer compliance](#transfer-compliance-⬆)

## What is @erc-3643/vue-usedapp [⬆](#table-of-contents)
The `@erc-3643/vue-usedapp` package provides a set of Vue composables for ERC3643 tokens.

## Installation [⬆](#table-of-contents)
1. Install module

    `npm i @erc-3643/vue-usedapp --save`
1. `reflect-metadata` is required, install it too:

   `npm install reflect-metadata --save`

   and make sure to import it in a global place, like `app.ts`:

   ```typescript
   import 'reflect-metadata';
   ```


## Usage examples [⬆](#table-of-contents)
### Token API [⬆](#table-of-contents)
```typescript
<script setup lang="ts">
import { useToken } from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { useEthers } from 'vue-dapp';
import { TOKEN_ADDRESS } from '@/constants';

const { signer } = useEthers()

const tokenData = ref<{ [key: string]: any }>({});

watch(signer, async (signer) => {
  if (signer) {
    const {
      token,
      isPaused
    } = await useToken(TOKEN_ADDRESS, signer);
    tokenData.value.decimals = await token.decimals()
    tokenData.value.name = await token.name()
    tokenData.value.owner = await token.owner()
    tokenData.value.totalSupply = await token.totalSupply()
    tokenData.value.balanceOf = await token.balanceOf()
    tokenData.value.frozenTokens = await token.frozenTokens()
    tokenData.value.realBalanceOf = await token.realBalanceOf()
    tokenData.value.isPaused = isPaused;
    tokenData.value.walletIsFrozen = await token.walletIsFrozen(await signer.getAddress())
  }
})
</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="token-info">
      <q-card-section>
        <div class="text-h6">Token info:</div>
      </q-card-section>
      <q-card-section>
        <p>Decimals: {{ tokenData.decimals }}</p>
        <p>Name: {{ tokenData.name }}</p>
        <p>Owner: {{ tokenData.owner }}</p>
        <p>Total Supply: {{ tokenData.totalSupply }}</p>
        <p>Balance Of: {{ tokenData.balanceOf }}</p>
        <p>Frozen Tokens: {{ tokenData.frozenTokens }}</p>
        <p>Real Balance Of: {{ tokenData.realBalanceOf }}</p>
        <p>
          Wallet Is Frozen: {{  }}
          <q-chip v-if="tokenData.walletIsFrozen" color="negative" text-color="white">
            Yes
          </q-chip>
          <q-chip v-else color="positive" text-color="white">
            No
          </q-chip>
        </p>
        <p>
          Token Is Paused:
          <q-chip v-if="tokenData.isPaused" color="negative" text-color="white">
            Yes
          </q-chip>
          <q-chip v-else color="positive" text-color="white">
            No
          </q-chip>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>
```
### Transfer compliance [⬆](#table-of-contents)
```typescript
<script setup lang="ts">
import { useTransferCompliance } from '@erc-3643/vue-usedapp';
import { ref, watch } from 'vue';
import { Signer } from 'ethers';
import { useEthers } from 'vue-dapp';
import { BOB_WALLET, TOKEN_ADDRESS } from '@/constants';

const { signer } = useEthers();

const signerAddress = ref('');
const addressToTransfer = ref('');
const amountToTransfer = ref(0);
const transferOk = ref(null);
const complianceErrors = ref([]);

watch(signer, async (signer) => {
  if (signer) {
    signerAddress.value = await signer.getAddress()
  }
});

const canTransfer = async () => {
  const transferCompliant = useTransferCompliance();
  const { result, errors } = await transferCompliant.isTransferCompliant(
    signer.value as Signer,
    TOKEN_ADDRESS,
    signerAddress.value,
    addressToTransfer.value,
    amountToTransfer.value
  );
  transferOk.value = result as any;
  complianceErrors.value = errors as any;
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
```
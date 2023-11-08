# @erc3643/core

![Build Status](https://github.com/ERC-3643/erc3643-packages/actions/workflows/push-checking.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@erc-3643%2Fcore.svg)](https://badge.fury.io/js/@erc-3643%2Fcore)
[![NPM Downloads](https://img.shields.io/npm/dt/@erc-3643%2Fcore.svg)](https://www.npmjs.com/package/@erc-3643%2Fcore)

## Table of contents
- [What is @erc-3643/core](#what-is-erc-3643core-⬆)
- [Installation](#installation-⬆)
- [Usage examples](#usage-examples-⬆)
  - [React hooks](#react-hooks-⬆)
    - [Token API](#token-api)
    - [Transfer compliance](#transfer-compliance)
  - [Vue composables](#vue-composables-⬆)
    - [Token API](#token-api-1)
    - [Transfer compliance](#transfer-compliance-1)

## What is @erc-3643/core [⬆](#table-of-contents)
The `@erc-3643/core` package provides an API for ERC3643 tokens.
The ERC3643 protocol is an open-source suite of smart contracts that enables the issuance, management, and transfer of permissioned tokens.

## Installation [⬆](#table-of-contents)
1. Install module

    `npm i @erc-3643/core --save`
1. `reflect-metadata` is required, install it too:

   `npm install reflect-metadata --save`

   and make sure to import it in a global place, like `app.ts`:

   ```typescript
   import 'reflect-metadata';
   ```

## Usage examples [⬆](#table-of-contents)
### React hooks [⬆](#table-of-contents)
#### Token API
```typescript
import { TokenContract } from "@erc-3643/core";
import { useEffect, useState } from "react";
import { Signer } from "@ethersproject/abstract-signer";

export interface Token {
  owner: any;
  name: any;
  totalSupply: any;
  decimals: any;
  frozenTokens: any;
  realBalanceOf: any;
  balanceOf: any;
  paused: any;
  walletIsFrozen: any;
  identityRegistry: any;
  pause: () => Promise<void>;
  run: () => Promise<void>;
  unfreeze: (address: string) => Promise<void>;
  freeze: (address: string) => Promise<void>;
  compliance: () => Promise<any>;
  isWalletFrozen: (walletAddress: string) => Promise<boolean>;
  getFrozenTokens: (walletAddress: string) => Promise<boolean>;
  getBalance: (walletAddress: string) => Promise<any>;
  areTransferPartiesFrozen: (from: string, to: string) => Promise<void>;
  isEnoughSpendableBalance: (from: string, amount: number) => Promise<void>;
}

export const useToken = (signer: Signer | undefined, debug = false) => {
  const [token, setToken] = useState<any>();

  const getTkn = async (tokenAddress: string): Promise<Token | null> => {
    if (!signer) {
      return null;
    }

    const token = await TokenContract.init(tokenAddress, signer);

    setToken(token);

    if (!token) {
      return null;
    }

    return {
      owner: await token.owner(),
      name: await token.name(),
      totalSupply: await token.totalSupply(),
      decimals: await token.decimals(),
      frozenTokens: await token.frozenTokens(),
      realBalanceOf: await token.realBalanceOf(),
      balanceOf: await token.balanceOf(),
      paused: await token.paused(),
      walletIsFrozen: await token.walletIsFrozen(),
      identityRegistry: await token.identityRegistry(),
      pause: token.pause,
      run: token.run,
      unfreeze: token.unfreeze,
      freeze: token.freeze,
      compliance: token.compliance,
      isWalletFrozen: token.isWalletFrozen,
      getFrozenTokens: token.getFrozenTokens,
      getBalance: token.getBalance,
      areTransferPartiesFrozen: token.areTransferPartiesFrozen,
      isEnoughSpendableBalance: token.isEnoughSpendableBalance,
    };
  };

  useEffect(() => {
    if (!signer || !token) {
      return;
    }

    if (token.contract) {
      token.contract.on("Paused", () => {
        setToken({ ...token, paused: true });
      });

      token.contract.on("Unpaused", () => {
        setToken({ ...token, paused: false });
      });

      token.contract.on(
        "AddressFrozen",
        (
          walletAddressToFreeze: string,
          isFrozen: boolean,
          signerAddress: string
        ) => {
          console.log(walletAddressToFreeze, "is frozen", isFrozen);
        }
      );

      token.contract.on("error", (error: Error) => {
        console.log(error);
      });
    }

    if (debug) {
      signer.provider?.on("debug", (data: any) => console.log(...data));
    }
  }, [token]);

  return {
    getToken: getTkn,
  };
};
```
#### Transfer compliance
```typescript
import { getTransferCompliance } from '@erc-3643/core'

export const useTransferCompliance = () => {
  const {
    isTransferCompliant
  } = getTransferCompliance;

  return {
    isTransferCompliant
  };
};
```

### Vue composables [⬆](#table-of-contents)
#### Token API
```typescript
import 'reflect-metadata';
import { ref } from 'vue';
import { Signer } from 'vue-dapp';
import { TokenContract } from '@erc-3643/core';

export async function useToken(tokenAddress: string, signer: Signer) {

  const token = TokenContract.init(tokenAddress, signer);

  const isPaused = ref(false);
  isPaused.value = await token.paused();

  token.contract.on('Paused', () => {
    isPaused.value = true;
  });

  token.contract.on('Unpaused', () => {
    isPaused.value = false;
  });

  token.contract.on('AddressFrozen', (walletAddressToFreeze: string, isFrozen: boolean, signerAddress: string) => {
    console.log(walletAddressToFreeze, 'is frozen', isFrozen);
  });

  token.contract.on('error', (error: Error) => {
    console.log(error);
  })

  return {
    token,
    isPaused
  };
}
```

#### Transfer compliance
```typescript
import { getTransferCompliance } from '@erc-3643/core';

export function useTransferCompliance() {
  return getTransferCompliance
}
```
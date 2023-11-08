# @erc-3643/react-usedapp

![Build Status](https://github.com/ERC-3643/erc3643-packages/actions/workflows/push-checking.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@erc-3643%2Freact-usedapp.svg)](https://badge.fury.io/js/@erc-3643%2Freact-usedapp)
[![NPM Downloads](https://img.shields.io/npm/dt/@erc-3643%2Freact-usedapp.svg)](https://www.npmjs.com/package/@erc-3643%2Freact-usedapp)

## Table of contents
- [What is @erc-3643/react-usedapp](#what-is-erc-3643react-usedapp-⬆)
- [Installation](#installation-⬆)
- [Usage examples](#usage-examples-⬆)
  - [Hooks](#hooks-⬆)
    - [Token API](#token-api)
    - [Eligibility verification info](#eligibility-verification-info)
  - [Components](#components-⬆)
    - [Holder eligibility verification](#holder-eligibility-verification)

## What is @erc-3643/react-usedapp [⬆](#table-of-contents)
The `@erc-3643/react-usedapp` package provides a set of React hooks and components for ERC3643 tokens.

## Installation [⬆](#table-of-contents)
1. Install module

    `npm i @erc-3643/react-usedapp --save`
1. `reflect-metadata` is required, install it too:

   `npm install reflect-metadata --save`

   and make sure to import it in a global place, like `app.ts`:

   ```typescript
   import 'reflect-metadata';
   ```

## Usage examples [⬆](#table-of-contents)

### Hooks [⬆](#table-of-contents)
#### Token API
```typescript
import { useSigner } from '@usedapp/core'
import { Token, useToken } from '@erc-3643/react-usedapp'
import { useEffect, useState } from 'react'
// ... other imports

const TokenActions = () => {
  const signer = useSigner()
  const { getToken } = useToken(signer)
  const [token, setToken] = useState<Token | null>(null)
  const [freezeWallet, setFreezeWallet] = useState('')
  const [unfreezeWallet, setUnfreezeWallet] = useState('')

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setToken(await getToken(TOKEN_ADDRESS))
    })()
  }, [signer])

  const onPause = async () => {
    if (!token) {
      return
    }

    if (token.paused) {
      await token.run()
    } else {
      await token.pause()
    }

    setToken(await getToken(TOKEN_ADDRESS))
  }

  const onFreeze = () => {
    if (!freezeWallet || !token) {
      return
    }

    token.freeze(freezeWallet)
  }

  const onUnfreeze = () => {
    if (!unfreezeWallet || !token) {
      return
    }

    token.unfreeze(unfreezeWallet)
  }

  return (
    <>
      {' '}
      <h3>Token actions</h3>
      <div>
        Pause token:{' '}
        {token && (
          <Button variant='contained' color={token.paused ? 'success' : 'error'} onClick={onPause}>
            {token.paused ? 'Run' : 'Pause'}
          </Button>
        )}
      </div>
      <!-- ... rest of the markup -->
    </>
  )
}

export default TokenActions
```
#### Eligibility verification info
```typescript
import { useSigner } from '@usedapp/core'
import { useEligibilityVerification, useToken } from '@erc-3643/react-usedapp'
import { useEffect, useState } from 'react'
// ... other imports

const EligibilityVerificationInfo = () => {
  const signer = useSigner()
  const { getToken } = useToken(signer)
  const { getEligibilityVerification } = useEligibilityVerification(signer)
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      const token = await getToken(TOKEN_ADDRESS)

      if (token) {
        setIdentityRegistryAddress((token.identityRegistry) as string)
      }
    })()
  }, [signer])

  useEffect(() => {
    if (!identityRegistryAddress) {
      return
    }

    ;(async () => {
      setVerificationResult(await getEligibilityVerification(identityRegistryAddress, null))
    })()
  }, [identityRegistryAddress])

  return (
    <>
      <h3>Eligibility Verification:</h3>
      <div>
        Identity Is Verified:
        {verificationResult?.identityIsVerified ? (
          <StyledChip label='Yes' color='success' />
        ) : (
          <StyledChip label='No' color='error' />
        )}
      </div>
      <div>
        <p>Missing Claim Topics:</p>
        <div>
          <pre>{JSON.stringify(verificationResult?.missingClaimTopics ?? [], null, 4)}</pre>
        </div>
      </div>
      <div>
        <p>Invalid Claims: </p>
        <div>
          <pre>{JSON.stringify(verificationResult?.invalidClaims ?? [], null, 4)}</pre>
        </div>
      </div>
    </>
  )
}

export default EligibilityVerificationInfo
```

### Components [⬆](#table-of-contents)
#### Holder eligibility verification
```typescript
import { EligibilityVerificationHolder } from '@erc-3643/react-usedapp'
import { useSigner } from '@usedapp/core'
import { useEffect, useState } from 'react'
// ... other imports

const EligibilityVerificationHolderInfo = () => {
  const signer = useSigner()
  const [signerAddress, setSignerAddress] = useState('')

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setSignerAddress(await signer.getAddress())
    })()
  }, [signer])

  return (
    <>
      <h3>Holder eligibility verification:</h3>
      <div>
        <EligibilityVerificationHolder
          tokenAddress={TOKEN_ADDRESS}
          walletAddress={signerAddress}
          signer={signer as Signer}
        />
      </div>
    </>
  )
}

export default EligibilityVerificationHolderInfo
```




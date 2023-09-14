import { Button, Input } from 'antd'
import { useSigner } from '@usedapp/core'
import { Token, useToken } from '@erc-3643/react-usedapp'
import { useEffect, useState } from 'react'
import { BOB_WALLET, TOKEN_ADDRESS } from '../../constants'
import { StyledFieldRow, StyledWalletExample } from './TokenActions.styles'

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
    <div>
      <h3>Token actions</h3>
      <div>
        Pause token:{' '}
        {token && (
          <Button type='primary' onClick={onPause}>
            {token.paused ? 'Run' : 'Pause'}
          </Button>
        )}
      </div>
      <StyledFieldRow>
        <Input
          placeholder='Wallet address to freeze'
          onChange={(e) => setFreezeWallet(e.target.value)}
        />
        <StyledWalletExample>ex. Bob wallet: {BOB_WALLET}</StyledWalletExample>
        <div>
          <Button type='primary' onClick={onFreeze}>
            Freeze wallet
          </Button>
        </div>
      </StyledFieldRow>
      <StyledFieldRow>
        <Input
          placeholder='Wallet address to unfreeze'
          onChange={(e) => setUnfreezeWallet(e.target.value)}
        />
        <StyledWalletExample>ex. Bob wallet: {BOB_WALLET}</StyledWalletExample>
        <div>
          <Button type='primary' onClick={onUnfreeze}>
            Unfreeze wallet
          </Button>
        </div>
      </StyledFieldRow>
    </div>
  )
}

export default TokenActions

import { Token, useToken } from '@erc-3643/react-usedapp'
import { TOKEN_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'
import { StyledChip } from '../../components/Chip/Chip.styles'

const TokenInfo = () => {
  const { formatEther } = utils
  const signer = useSigner()
  const { getToken } = useToken(signer)
  const [token, setToken] = useState<Token | null>(null)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setToken(await getToken(TOKEN_ADDRESS))
    })()
  }, [signer])

  return (
    <>
      <h3>Token info:</h3>
      {token && (
        <>
          <p>Decimals: {token?.decimals}</p>
          <p>Name: {token?.name ?? ''}</p>
          <p>Owner: {token?.owner}</p>
          <p>Total Supply: {formatEther(token?.totalSupply ?? 0)}</p>
          <p>Balance Of: {formatEther(token?.balanceOf ?? 0)}</p>
          <p>Frozen Tokens: {formatEther(token?.frozenTokens ?? 0)}</p>
          <p>Real Balance Of: {formatEther(token?.realBalanceOf ?? 0)}</p>
          <p>
            Wallet Is Frozen:{' '}
            {token?.walletIsFrozen ? (
              <StyledChip label='Yes' color='error' />
            ) : (
              <StyledChip label='No' color='success' />
            )}
          </p>
          <p>
            Token Is Paused:{' '}
            {token?.paused ? (
              <StyledChip label='Yes' color='error' />
            ) : (
              <StyledChip label='No' color='success' />
            )}
          </p>
        </>
      )}
    </>
  )
}

export default TokenInfo

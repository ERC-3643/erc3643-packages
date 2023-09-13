import { useToken } from '@erc-3643/react-usedapp'
import { TOKEN_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'
import { utils } from 'ethers'

const TokenInfo = () => {
  const { formatEther } = utils
  const signer = useSigner()
  const token = useToken(TOKEN_ADDRESS, signer)

  return (
    <div>
      <h3>Token info:</h3>
      <div>Decimals: {token?.decimals}</div>
      <div>Name: {token?.name ?? ''}</div>
      <div>Owner: {token?.owner}</div>
      <div>Total Supply: {formatEther(token?.totalSupply ?? 0)}</div>
      <div>Balance Of: {formatEther(token?.balanceOf ?? 0)}</div>
      <div>Frozen Tokens: {formatEther(token?.frozenTokens ?? 0)}</div>
      <div>Real Balance Of: {formatEther(token?.realBalanceOf ?? 0)}</div>
      <div>Wallet Is Frozen: {token?.walletIsFrozen ? 'Yes' : 'No'}</div>
      <div>Token Is Paused: {token?.paused ? 'Yes' : 'No'}</div>
    </div>
  )
}

export default TokenInfo

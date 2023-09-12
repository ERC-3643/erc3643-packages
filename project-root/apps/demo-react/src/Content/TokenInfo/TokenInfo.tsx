import { useToken } from '@erc-3643/react-usedapp'
import { TOKEN_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'

const TokenInfo = () => {
  const signer = useSigner()
  const token = useToken(TOKEN_ADDRESS, signer);
  console.log(token);
  return <div>
    <h3>Token info:</h3>
    Decimals:

    Name:

    Owner:

    Total Supply:

    Balance Of:

    Frozen Tokens:

    Real Balance Of:

    Wallet Is Frozen:
    No

    Token Is Paused:
    No

  </div>
}

export default TokenInfo

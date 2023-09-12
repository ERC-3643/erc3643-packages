import { StyledPill, StyledHeader, StyledLeftCol, StyledRightCol, StyledRow } from './Header.styles'
import ConnectButton from './ConnectBtn/ConnectButton'
import { useSigner } from '@usedapp/core'
import { TOKEN_ADDRESS } from '../constants'
import { useToken } from '@erc-3643/react-usedapp'

const Header = () => {
  const signer = useSigner()

  const token = useToken(TOKEN_ADDRESS, signer)

  console.log(token)

  const address = '0x9965...A4dc'
  const coinsAmount = 100000

  return (
    <StyledHeader>
      <StyledRow>
        <StyledLeftCol>ERC3643</StyledLeftCol>
        <StyledRightCol>
          <StyledPill>{address}</StyledPill>
          <StyledPill>{coinsAmount}ETH</StyledPill>
          <ConnectButton />
        </StyledRightCol>
      </StyledRow>
    </StyledHeader>
  )
}

export default Header

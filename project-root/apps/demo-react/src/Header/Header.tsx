import { StyledPill, StyledHeader, StyledLeftCol, StyledRightCol, StyledRow } from './Header.styles'
import ConnectButton from './ConnectBtn/ConnectButton'
import { useEthers, useEtherBalance } from '@usedapp/core'

const Header = () => {

  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const address = account;
  const coinsAmount = userBalance?.toString()

  return (
    <StyledHeader>
      <StyledRow>
        <StyledLeftCol>ERC3643</StyledLeftCol>
        <StyledRightCol>
          <StyledPill>{address}</StyledPill>
          <StyledPill>{coinsAmount} ETH</StyledPill>
          <ConnectButton />
        </StyledRightCol>
      </StyledRow>
    </StyledHeader>
  )
}

export default Header

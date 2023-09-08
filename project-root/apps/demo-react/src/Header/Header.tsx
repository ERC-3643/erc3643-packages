import { StyledPill, StyledHeader, StyledLeftCol, StyledRightCol, StyledRow } from './Header.styles'
import ConnectButton from './ConnectBtn/ConnectButton'
import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'

const Header = () => {
  const {account} = useEthers()
  const [token, setToken] = useState()

  useEffect(()=>{

  },[account])


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

import { StyledPill, StyledHeader, StyledLeftCol, StyledRightCol, StyledRow } from './Header.styles'
import ConnectButton from './ConnectBtn/ConnectButton'
import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { useToken } from '@erc-3643/react-usedapp'

const Header = () => {
  // const {signer} = useEthers()
  // const token = useToken("",account as Signer)
  // console.log(token)

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

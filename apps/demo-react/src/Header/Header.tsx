import { StyledPill, StyleLogoText } from './Header.styles'
import ConnectButton from './ConnectBtn/ConnectButton'
import { useEthers } from '@usedapp/core'
import { AppBar, Box, Toolbar } from '@mui/material'

const Header = () => {
  const { account } = useEthers()

  return (
    <AppBar position='fixed'>
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <StyleLogoText>ERC3643</StyleLogoText>{' '}
            <img src='/tokeny.png' alt='tokeny' width={150} />
          </Box>
          {account && <StyledPill>{account}</StyledPill>}
          <ConnectButton />
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default Header

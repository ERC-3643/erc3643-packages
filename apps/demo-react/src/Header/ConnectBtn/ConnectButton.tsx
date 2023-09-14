import { useEthers } from '@usedapp/core'
import { StyledConnectBtn } from './ConnectButton.styles'

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()

  if (account) {
    return (
      <StyledConnectBtn type='primary' onClick={() => deactivate()}>
        Disconnect
      </StyledConnectBtn>
    )
  }

  return (
    <StyledConnectBtn type='default' onClick={() => activateBrowserWallet()}>
      Connect
    </StyledConnectBtn>
  )
}

export default ConnectButton

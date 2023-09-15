import { useEthers } from '@usedapp/core'
import Button from '@mui/material/Button'

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()

  if (account) {
    return (
      <Button variant='contained' color='warning' onClick={() => deactivate()}>
        Disconnect
      </Button>
    )
  }

  return (
    <Button variant='contained' color='secondary' onClick={() => activateBrowserWallet()}>
      Connect
    </Button>
  )
}

export default ConnectButton

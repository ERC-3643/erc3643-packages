import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Goerli, Mainnet, DAppProvider, Hardhat } from '@usedapp/core'

const config = {
  readOnlyChainId: Hardhat.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/6543ad2bbb6e4a55b5fc2148a5f8f3cf',
    [Goerli.chainId]: 'https://goerli.infura.io/v3/6543ad2bbb6e4a55b5fc2148a5f8f3cf',
    [Hardhat.chainId]: 'http://localhost:8545',
  },
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DAppProvider, Goerli, Hardhat, Mainnet } from '@usedapp/core'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

const config = {
  readOnlyChainId: Hardhat.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/6543ad2bbb6e4a55b5fc2148a5f8f3cf',
    [Goerli.chainId]: 'https://goerli.infura.io/v3/6543ad2bbb6e4a55b5fc2148a5f8f3cf',
    [Hardhat.chainId]: 'http://localhost:8545',
  },
}

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#26a69a',
    },
    error: {
      main: '#c10015',
    },
    warning: {
      main: '#f2c037',
    },
    success: {
      main: '#21ba45',
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </DAppProvider>
  </React.StrictMode>,
)

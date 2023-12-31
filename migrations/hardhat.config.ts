import '@xyrusworx/hardhat-solidity-json';
import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';
import '@nomiclabs/hardhat-solhint';
import '@primitivefi/hardhat-dodoc';
// import { getAccounts } from '../migrations/sepolia-signers';
import { getLocalAccounts } from '../migrations/local-signers';

const infuraProjectId = '023b5330349a4db19ed95c89fb835050';
// const sepoliaAccounts = getAccounts();
const sepoliaAccounts: any = [];
const mumbaiAccounts: any = [];
const localAccounts = getLocalAccounts();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    root: '../T-REX'
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraProjectId}`,
      accounts: sepoliaAccounts,
      gas: 7000000,
      gasPrice: 3500000000 // 3.5 Gwei
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
      accounts: mumbaiAccounts,
      gas: 7000000
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: localAccounts
    }
  }
};

export default config;

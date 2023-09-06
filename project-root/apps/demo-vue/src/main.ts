import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueDapp } from 'vue-dapp'
import { ethers } from 'ethers'
import { createPinia } from 'pinia'
import toast from '@k90mirzaei/vue-toast'
import '@k90mirzaei/vue-toast/dist/index.css'
import { AppFullscreen, Dialog, Notify, Quasar, QuasarPluginOptions } from 'quasar'

// Import icon libraries
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.use(Quasar, {
  config: {
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx,vue}'
        }
      }
    }
  },
  plugins: {
    AppFullscreen,
    Notify,
    Dialog
  }, // import Quasar plugins and add here
} as Partial<QuasarPluginOptions>)


app.use(toast)

app.config.errorHandler = function (err, vm, info) {
  console.error(err);
  app.config.globalProperties.$toast.error(err.message);
}

app.use(createPinia())
app.use(router)
app.use(VueDapp, {
  autoConnect: true,
  dumb: false,
  networks: {
    31337: {
      chainId: ethers.utils.hexValue(31337),
      chainName: 'HardHat',
      rpcUrls: ['http://localhost:8545'],
      nativeCurrency: {
        name: 'Ethereum',
        decimals: 18,
        symbol: 'ETH',
      }
    },
    // 80001: {
    //   chainId: ethers.utils.hexValue(80001),
    //   blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    //   chainName: 'Mumbai',
    //   rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    //   nativeCurrency: {
    //     name: 'Mumbai',
    //     decimals: 18,
    //     symbol: 'MATIC',
    //   },
    // },
    // 42161: {
    //   chainId: ethers.utils.hexValue(42161),
    //   blockExplorerUrls: ['https://arbiscan.io'],
    //   chainName: 'Arbitrum One',
    //   rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    //   nativeCurrency: {
    //     name: 'Arbitrum',
    //     symbol: 'ETH',
    //     decimals: 18,
    //   },
    // },
  },
})

app.mount('#app')

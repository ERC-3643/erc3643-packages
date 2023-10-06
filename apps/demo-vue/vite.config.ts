import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nodeStdlibBrowser from 'node-stdlib-browser'
import inject from '@rollup/plugin-inject'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import swc from 'unplugin-swc'


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		swc.vite(),
		vue({
			template: { transformAssetUrls }
		}),
		quasar({
			sassVariables: 'src/quasar-variables.sass',
		})
	],
	resolve: {
		alias: {
			...nodeStdlibBrowser,
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext', // to enable nable Big integer literals
			inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
		},
	},
	build: {
		target: 'esnext', // Enable Big integer literals
		commonjsOptions: {
			transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
		},
		rollupOptions: {
			plugins: [
				inject({
					global: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'global'],
					process: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'process'],
					Buffer: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'Buffer'],
				}),
			],
		},
	}
})

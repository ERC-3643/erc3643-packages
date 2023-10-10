## Prerequsites

The `@erc3643/core` library uses dependency injection. To make it work, the following libraries should be installed:

```bash
npm install --save-dev unplugin-swc
npm install --save reflect-metadata
```

Configuration for the vite:

```javascript
// vite.config.ts
import swc from 'unplugin-swc'

export default defineConfig({
	plugins: [
		swc.vite(),
    // ...
  ],
  // ...
});
```
Example [vite.config.ts](./vite.config.ts)

Update tsconfig.ts

```json
{
  // ...
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  // ...
}

```

Example [tsconfig.json](./tsconfig.json)

# Vue 3 Dapp Starter

## Features
- [Vue 3](https://v3.vuejs.org/guide/introduction.html#what-is-vue-js) as the foundation
- [Quasar CSS](https://quasar.dev/start/pick-quasar-flavour) for styling
- [Vite](https://vitejs.dev/guide/) for faster builds
- [ethers.js](https://docs.ethers.io/v5/) for interacting with Ethereum
- [vue-dapp](https://github.com/chnejohnson/vue-dapp) for the wallet connect

## Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

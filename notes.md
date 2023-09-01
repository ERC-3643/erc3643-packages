# Tokeny

## General notes:
From email, we need `components that can be smoothly integrated into any DApp currently compatible with ERC20 tokens`.
- DApp - what it is, what are specific - requires understanding
- Github repos with DApp examples use `ethers.js` instead of `web3`
- For react I found https://github.com/TrueFiEng/useDApp/tree/master framework
- [Important] Frameworks like useDApp, implement react specific modules to perform calls to ETH and also do stuff like: Refreshes on a new block, wallet change or network change. TODO: CAN'T find non framework implementations for this, and looks like this is needed if we are need to implement general purpose library. TODO: If we are building component to be integrated with other DApps (like email says) we may need to implement framework specific parts. E.g. Custom Hooks for react apps created with useDApp [https://usedapp-docs.netlify.app/docs/Guides/Reading/Custom%20Hooks] and find what can be used for VUE and Angular.
- Even we find libraries and frameworks, it's not clear how to integrate with existing DApp, because everything I see requires token address and API to be passed into libraries to communicate with them. This means that we potentially we are required to destribute with library 3643 API, see https://github.com/TrueFiEng/useDApp/blob/master/packages/core/src/constants/abi/ERC20.json but how this can be used as extention for already ERC20 complient application - not clear.
- Verification and Check requirements. Functions like `canTransfer` are 3643 specific and to be used will not be related to ERC20. So, again, is not clear how `compatible with ERC20` DApp will be intergated / updated with 3643. The same time `balanceOf` function requirement says that logic behind this, must be different (so, sounds like override, but override of what?)
- Potentially https://github.com/TokenySolutions/EIP3643/blob/main/eip-3643.md is not in the lates state. See `Compliance Verification` requirement, and for details https://github.com/TokenySolutions/T-REX was used, because it has requirement specifics related to moduleCheck
- https://github.com/TokenySolutions/T-REX can be used for development? and we do not need to ask for deployed token? see tools to use with React app
- `Compliance Verification` requirement requires understanding on how 3643 works, and all UI development will be dependent on this understanding. This is not a "general problem" solution.


## React specific cases:

```js
// based on https://dev.to/richardmelko/ethereum-dapp-crash-course-make-an-erc20-token-faucet-frontend-2m43
/*
react - our client side front end
react-bootstrap - fast css component styling
hardhat - ethereum / solidity development environment
ethers.js - ethereum / web client library (used instead of web3)
remix - an in-browser solidity development environment
metamask - our in-browser wallet which we will use to interact with our application
openzeppelin contracts a library of safe and audited smart contract solidity code
chai - a javascript assertion library for running tests
waffle - a library for smart contract testing
infura.io - An IPFS API that will connect our application to a live testnet
Goreli - The live testnet we'll be using
Github & Netlify - To host our client side UI
*/
```

## Refs:

- https://dev.to/richardmelko/ethereum-dapp-crash-course-make-an-erc20-token-faucet-frontend-2m43
- https://usedapp-docs.netlify.app/docs/Guides/Reading/Custom%20Hooks
- https://github.com/TrueFiEng/useDApp/blob/master/packages/core/src/constants/abi/ERC20.json
- https://www.npmjs.com/package/erc-token-js?activeTab=readme
- https://www.npmjs.com/package/@tokenysolutions/t-rex
- https://ethereum.org/en/developers/docs/standards/tokens/erc-20/


## Current proposal, aka initial state

- create monorepo, done with 
- 
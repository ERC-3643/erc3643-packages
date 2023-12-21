# ERC 3643 UI components

> Plug-in components for ERC 3643 T-REX token suite.

## TOC

* [Local blockchain deployment](./migrations/README.md)
* [VueJS setup](./apps/demo-vue/README.md)
* [ReactJS setup](./apps/demo-react/README.md)

## Contribution

### Packages

Packages are managed using lerna.

To run test (or any task) on all packages, run `npx lerna run <task, ex: test>`.

Publication is done via github action when a release is created on GitHub. Note that the release action will only
publish packages which version where upgraded. To increase version of all packages, you can run the helper command
`npx lerna version --no-private`.

## Authors and Contributors:

Dev.Pro <info@dev.pro> — developed interoperable native TypeScript, React, and Vue components that can be integrated into the DApps currently compatible with ERC-20 tokens.
TokenySolution <contact@tokeny.com> - ERC 3643

Individual Contributors:

- Vladyslav Khymenko <vladyslav.khymenko@dev.pro> — Core library and 3rd-party integrations.
- Valeriy Ilihmetov <valeriy.ilihmetov@dev.pro> — Core library, Vue components and preview.
- Oleksii Sirochenko <oleksii.sirochenko@dev.pro> — React hooks and a preview.
- Kostiantyn Dmitriiev <kostiantyn.dmitriiev@dev.pro> — managed product side of ERC-3643 library and integration with Uniswap UI.
- Kevin Thizy <kevin@thizy.eu> - ERC 3643 co-author and package publication configuration.
- Joachim Lebrun <joachim@tokeny.com> - Main author of ERC-3643 - expertise on the standard and product specifications.

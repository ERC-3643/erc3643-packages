const path = require('path');
const { override, babelInclude, addBabelPlugin } = require('customize-cra');
const babelTsTransformPlugin = require('babel-plugin-transform-typescript-metadata');
// const {alias} = require('react-app-rewire-alias');

module.exports = function (config, env) {
  config.module.rules.unshift({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    },
  });

  const newConfig = Object.assign(
      config,
      override(
          babelInclude([
              path.resolve('src'),
          ]),
          addBabelPlugin(babelTsTransformPlugin)
          // alias({
          //     /* Fix several clones of React (https://reactjs.org/warnings/invalid-hook-call-warning.html) */
          //     'react': 'node_modules/react'
          // })
      )(config, env)
  );

  return newConfig;
}
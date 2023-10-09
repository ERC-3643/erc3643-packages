const path = require('path');
const { override, babelInclude, addBabelPlugin } = require('customize-cra');
const babelTsTransformPlugin = require('babel-plugin-transform-typescript-metadata');
// const {alias} = require('react-app-rewire-alias');

module.exports = function (config, env) {
    return Object.assign(
        config,
        override(
            babelInclude([
                path.resolve('src'),
                path.resolve('../../packages/@erc-3643/core/src'),
                path.resolve('../../packages/@erc-3643/react-useDapp/src'),
            ]),
            addBabelPlugin(babelTsTransformPlugin)
            // alias({
            //     /* Fix several clones of React (https://reactjs.org/warnings/invalid-hook-call-warning.html) */
            //     'react': 'node_modules/react'
            // })
        )(config, env)
    );
}
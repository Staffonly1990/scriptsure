/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const postcssOptions = require('../postcss.config');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions/register',
    '@storybook/addon-toolbars',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    'storybook-react-intl',
    'storybook-addon-intl/register',
    'storybook-dark-mode/register',
  ],
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        shouldExtractLiteralValuesFromEnum: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
    },
  },
  webpackFinal: async (config) => {
    config.module.rules = [
      // // "devDependencies": {
      // //   "string-replace-loader": "2.3.0",
      // //   "react-popper-storybook": "npm:react-popper@^2.2.3",
      // // }
      // {
      //   test: /\.js$/,
      //   loader: 'string-replace-loader',
      //   options: {
      //     search: "from 'react-popper'",
      //     replace: "from 'react-popper-storybook'",
      //   },
      // },
      ...config.module.rules,
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: { ident: 'postcss', ...postcssOptions },
          },
        ],
        include: path.resolve(__dirname, '../'),
      },
    ];

    return config;
  },
  babel: async (options) => ({
    ...options,
  }),
};

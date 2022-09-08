/* eslint-disable @typescript-eslint/no-var-requires */
const postcssOptions = require('./postcss.config');

module.exports = {
  plugins: [],
  webpack: {},
  style: { postcss: { ...postcssOptions } },
  jest: {},
};

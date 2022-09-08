/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  plugins: [
    require('postcss-color-function'),
    require('postcss-each'),
    require('postcss-conditionals'),
    require('postcss-import'),
    require('tailwindcss/nesting')(require('postcss-nesting')),
    require('tailwindcss'),
    // require('postcss-preset-env')({ features: { 'nesting-rules': false } }),
    require('postcss-100vh-fix'),
    require('autoprefixer'),
  ],
};

/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
});

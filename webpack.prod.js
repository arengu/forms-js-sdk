const common = require('./webpack.common.js');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        // keep_classnames: true,
        // keep_fnames: true
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ]
});

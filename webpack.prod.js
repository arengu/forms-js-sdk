const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        // keep_classnames: true,
        // keep_fnames: true
      }
    }),
  ]
});

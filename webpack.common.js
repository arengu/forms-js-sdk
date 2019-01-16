const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const DEFAULT_API_URL = 'https://api.arengu.com';

module.exports = {
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Playground'
    }),
    new webpack.DefinePlugin({
      'WEBPACK_API_URL': JSON.stringify(process.env.API_URL || DEFAULT_API_URL)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'to-string-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
        ]
      }
    ]
  },
  output: {
    filename: 'forms.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ArenguForms'
  }
};

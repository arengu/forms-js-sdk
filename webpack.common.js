/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');

const { version: pkgVersion } = require('./package.json');
/* eslint-enable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */

const DEFAULT_API_URL = 'https://api.arengu.com';

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Playground',
    }),
    new webpack.DefinePlugin({
      SDK_VERSION: JSON.stringify(pkgVersion),
      API_URL: JSON.stringify(process.env.API_URL || DEFAULT_API_URL),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {

    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-typescript',
              ],
              [
                '@babel/preset-env',
                {
                  debug: true,
                  modules: false,
                  targets: {
                    browsers: [
                      'chrome >= 46',
                      'firefox >= 45',
                      'safari >= 10',
                      'ios >= 10',
                      'edge >= 13',
                      'opera >= 33',
                    ],
                  },
                },
              ],
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'to-string-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postcssPresetEnv(),
              ],
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'forms.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ArenguForms',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
};

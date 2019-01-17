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
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  debug: true,
                  modules: 'commonjs',
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

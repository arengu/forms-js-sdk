function defineLoader({ presets = [], plugins = [] } = {}) {
  return {
    test: /\.(t|j)sx?$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-typescript',
          ],
          ...presets,
        ],
        plugins: [
          [
            'transform-class-properties',
          ],
          ...plugins,
        ],
      },
    },
  };
}

module.exports = {
  defineLoader,
};

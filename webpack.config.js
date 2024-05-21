const path = require('path');

module.exports = {
  entry: {
    image : './src/image.js',
    test: './src/test.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'eval-source-map',
};
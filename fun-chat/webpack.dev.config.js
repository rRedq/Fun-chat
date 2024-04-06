const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: path.resolve(__dirname, './src'),
  },
};

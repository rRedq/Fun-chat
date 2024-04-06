const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const EslingPlugin = require('eslint-webpack-plugin');
const prodConfig = require('./webpack.prod.config');
const devConfig = require('./webpack.dev.config');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      { test: /\.ts$/i, use: 'ts-loader' },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@controller': path.resolve(__dirname, 'src/app/components/controller/'),
      '@view': path.resolve(__dirname, 'src/app/components/view/'),
      '@model': path.resolve(__dirname, 'src/app/components/model/'),
      '@data': path.resolve(__dirname, 'src/app/data/'),
      '@assets': path.resolve(__dirname, 'src/app/assets/images'),
      '@fields': path.resolve(__dirname, 'src/app/fields/'),
      '@utils': path.resolve(__dirname, 'src/app/utils/'),
      '@interfaces': path.resolve(__dirname, 'src/app/interfaces/'),
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new DotenvWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new EslingPlugin({ extensions: 'ts' }),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? prodConfig : devConfig;

  return merge(baseConfig, envConfig);
};

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const plugins = [];

const entry = [path.resolve(__dirname, './src/server.ts')];

const output = {
  path: path.resolve(__dirname, './dist'),
  filename: 'server.bundle.js',
};

module.exports = {
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV,
  entry,
  output,
  target: 'node',
  plugins,
  module: {
    rules: [
      {
        test: /\.(graphql|gql)/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.ts/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.json', '.ts', '.gql'],
  },
};

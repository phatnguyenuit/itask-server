const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/** @type {webpack.Configuration['plugins']} */
const plugins = [];

/** @type {webpack.Configuration['entry']} */
const entry = [path.resolve(__dirname, './src/server.ts')];

/** @type {webpack.Configuration['output']} */
const output = {
  path: path.resolve(__dirname, './dist'),
  filename: 'server.bundle.js',
};

/** @type {webpack.Configuration} */
const config = {
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  mode: process.env.NODE_ENV,
  entry,
  output,
  target: 'node', // to exclude nodejs modules like fs, path, and ...etc
  plugins,
  module: {
    rules: [
      {
        test: /\.(graphql|gql)/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        // Ignore: .d.ts, .test.ts, and .spec.ts files
        test: /.+(?<!\.d|\.test|\.spec)\.ts/,
        use: {
          loader: 'ts-loader',
        },
        // Excludes: node_modules, and __tests__ folders
        exclude: [/node_modules/, /__tests__/],
      },
    ],
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.json', '.ts', '.gql'],
    plugins: [new TsconfigPathsPlugin()],
  },
};

module.exports = config;

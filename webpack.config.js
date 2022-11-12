const webpack = require('webpack');
const path = require('path');

module.exports = [
  {
    target: 'node',
    entry: ['./dist/index.js'],
    mode: 'production',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: 'facade.js'
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
    ],
    externals: {
      phantombuster: 'commonjs2 phantombuster', // this makes sure webpack doesn't try to bundle the "phantombuster" module
      puppeteer: 'commonjs2 puppeteer',
      ajv: 'commonjs2 ajv'
    },
    optimization: {
      minimize: false // we disable the minimization plugin to keep the phantombuster package comment directives
    }
  },
  {
    target: 'node',
    entry: ['./dist/common/index.js'],
    mode: 'production',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: 'lib-common.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    externals: {
      phantombuster: 'commonjs2 phantombuster', // this makes sure webpack doesn't try to bundle the "phantombuster" module
      puppeteer: 'commonjs2 puppeteer',
      ajv: 'commonjs2 ajv'
    },
    optimization: {
      minimize: true // we disable the minimization plugin to keep the phantombuster package comment directives
    }
  },
  {
    target: 'node', // this will tell webpack to compile for a Node.js environment
    entry: ['./dist/recipe/lib-recipe-supplier.js'],
    mode: 'production',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: 'lib-recipe-supplier.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    externals: {
      phantombuster: 'commonjs2 phantombuster', // this makes sure webpack doesn't try to bundle the "phantombuster" module
      puppeteer: 'commonjs2 puppeteer',
      ajv: 'commonjs2 ajv'
    },
    optimization: {
      minimize: true // we disable the minimization plugin to keep the phantombuster package comment directives
    }
  }
];

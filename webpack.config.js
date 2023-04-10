const path = require('path');
const nodeExternals = require('webpack-node-externals');
// const Dotenv = require('dotenv-webpack');
// const { DefinePlugin } = require('webpack');

// config for ts2bundle
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  process.env.NODE_ENV = isProd ? 'production' : 'development'

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'release'),
      filename: 'hms_uploader_service.js'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    target: 'node',
    externals: [nodeExternals()]
  }
};

// config for build js2bundle
/*
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  process.env.NODE_ENV = isProd ? 'production' : 'development'

  return {
    entry: './dist/index.js',
    output: {
      path: path.resolve(__dirname, 'finaldist'),
      filename: 'hms_uploader_service.js'
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [
      new Dotenv()
    ]
  }
};
*/
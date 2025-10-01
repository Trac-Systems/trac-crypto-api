const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './index.react-native.js',
  output: {
    filename: 'trac-crypto-api.rn.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    publicPath: '',
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        default: false
      }
    },
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      'sodium-universal': 'sodium-javascript'
    },
    // Adicionando .ts e .tsx para garantir que o Webpack resolva as dependências
    // corretamente, mesmo que sua biblioteca seja JS.
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify"),
      "fs": false,
      "path": false,
      "util": false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // Loader para ignorar o código nativo do react-native-b4a
        include: /node_modules\/react-native-b4a/,
        use: {
          loader: 'ignore-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
}

const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',

  entry: './index.rn.js',

  output: {
    filename: 'trac-crypto-api.rn.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2', // ✅ Keep CommonJS output
    publicPath: '',
  },

  target: ['web', 'es5'], // ✅ Prevent browser globals like 'document'
  node: {
    global: true,
    __filename: 'mock',
    __dirname: 'mock',
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: { default: false },
    },
    runtimeChunk: false,
  },

  resolve: {
    alias: {
      // Sodium
      'sodium-universal': 'sodium-javascript',

      // Disable wasm-based blake3 for React Native
      '@tracsystems/blake3/dist/wasm/blake3_wasm.mjs': false,
      '@tracsystems/blake3/dist/wasm/internal/blake3_wasm.mjs': false,
      '@tracsystems/blake3': path.resolve(
        __dirname,
        'node_modules/@tracsystems/blake3/dist/wasm/blake3_rn.js'
      ),
    },

    extensions: ['.js', '.ts', '.tsx', '.mjs'],

    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      url: require.resolve('url'),
      assert: require.resolve('assert'),
      fs: false,
      path: false,
      util: false,
      module: false,
      wasm: false,
    },
  },

  module: {
    rules: [
      // Ignore react-native-b4a because it expects RN internals
      {
        test: /\.js$/,
        include: /node_modules\/react-native-b4a/,
        use: { loader: 'ignore-loader' },
      },

      // Babel for your modules and selected node_modules
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'modules'),
          path.resolve(__dirname, 'index.rn.js'),
          path.resolve(__dirname, 'node_modules/@tracsystems'), // blake3
          path.resolve(__dirname, 'node_modules/hdkey'),
          path.resolve(__dirname, 'node_modules/bip39-mnemonic'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: 'commonjs', // ✅ Force CommonJS everywhere
                  targets: { esmodules: true },
                },
              ],
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-transform-classes', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              ['@babel/plugin-transform-modules-commonjs', { loose: true }], // ✅ ensure import/export -> CJS
            ],
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    new webpack.ContextReplacementPlugin(
      /modules\/address$/,
      data => {
        delete data.dependencies[0].critical
        return
      }
    ),

    new webpack.IgnorePlugin({
      resourceRegExp: /randombytes\/browser|randombytes\/index/,
    }),

    // 🧩 Optional: Neutralize document / window if any dependency expects it
    new webpack.DefinePlugin({
      'typeof document': JSON.stringify('undefined'),
      'typeof window': JSON.stringify('undefined'),
      document: 'undefined',
      window: 'undefined',
    }),
  ],
}

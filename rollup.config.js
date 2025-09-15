import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'

export default {
  input: 'index.js', // seu entrypoint
  output: {
    file: 'dist/trac-crypto-api.browser.js',
    format: 'umd',
    name: 'TracCryptoApi', // window.TracCryptoApi
    sourcemap: true,
  },
  plugins: [
    json(),
    resolve({
      browser: true, // pega as versões "browser" se disponíveis
      preferBuiltins: false,
    }),
    commonjs(),
    replace({
      preventAssignment: true,
      values: {
        '__filename': JSON.stringify(''), // neutraliza no browser
        '__dirname': JSON.stringify(''),
      },
    }),
  ],
  // evita puxar sodium-native
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return
    warn(warning)
  },
}

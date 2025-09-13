// entry.js

const nonce = require('./modules/nonce.js')
const signature = require('./modules/signature.js')
const utils = require('./modules/utils.js')
const sodium = require('sodium-javascript') // AQUI está a mudança

module.exports = {
  nonce,
  signature,
  utils,
  sodium
}

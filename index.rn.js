const address = require('./modules/address.js');
const hash = require('./modules/hash.js');
const mnemonic = require('./modules/mnemonic.js');
const nonce = require('./modules/nonce.js');
const operation = require('./modules/operation.js');
const signature = require('./modules/signature.js');
const transaction = require('./modules/transaction.js');
const utils = require('./modules/utils.js');

const b4a = require('b4a');
const sodium = require('sodium-universal');

if (typeof location === 'undefined') {
  globalThis.location = { href: '' };
}
if (typeof document === 'undefined') {
  globalThis.document = { currentScript: { src: '' } };
}

module.exports = {
  address,
  hash,
  mnemonic,
  nonce,
  operation,
  signature,
  transaction,
  utils,
  b4a,
  sodium
};
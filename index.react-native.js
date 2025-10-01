const address = require('./modules/address.js')
// const data = require('./modules/data.js')
const hash = require('./modules/hash.js')
const mnemonic = require('./modules/mnemonic.js')
const nonce = require('./modules/nonce.js')
// const operation = require('./modules/operation.js')
const signature = require('./modules/signature.js')
// const transaction = require('./modules/transaction.js')
const utils = require('./modules/utils.js')


const b4a = require('b4a')
const sodium = require('sodium-universal')

module.exports = {
    address,
    // data,
    hash,
    mnemonic,
    nonce,
    // operation,
    signature,
    // transaction,
    utils,
    b4a,
    sodium
}

// COMMENTED MODULES ARE NOT WORKING YET FOR REACT NATIVE
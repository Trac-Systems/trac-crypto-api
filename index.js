const runtime = require('./modules/runtime.js')
const util = require('util')

if (runtime.isBare()) {
    global.TextEncoder = util.TextEncoder
    global.TextDecoder = util.TextDecoder
}

const address = require('./modules/address.js')
const data = require('./modules/data.js')
const hash = require('./modules/hash.js')
const mnemonic = require('./modules/mnemonic.js')
const nonce = require('./modules/nonce.js')
const operation = require('./modules/operation.js')
const signature = require('./modules/signature.js')
const transaction = require('./modules/transaction.js')
const utils = require('./modules/utils.js')

module.exports = {
    address,
    data,
    hash,
    mnemonic,
    nonce,
    operation,
    signature,
    transaction,
    utils,
}
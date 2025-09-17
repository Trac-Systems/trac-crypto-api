const runtime = require('which-runtime');
const util = require('util');

if (runtime.isBare) {
    global.TextEncoder = util.TextEncoder;
    global.TextDecoder = util.TextDecoder;
}

const address = require('./modules/address.js');
const hash = require('./modules/hash.js');
const mnemonic = require('./modules/mnemonic.js');
const nonce = require('./modules/nonce.js');
const signature = require('./modules/signature.js');
const data = require('./modules/data.js');
const utils = require('./modules/utils.js');
const transaction = require('./modules/transaction.js');

const sign = signature.sign;

module.exports = {
    address,
    hash,
    mnemonic,
    nonce,
    signature,
    data,
    utils,
    transaction,
    sign
};
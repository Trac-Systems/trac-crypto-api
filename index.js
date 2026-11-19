const util = require('util');

// ===== ENV DETECTION =====
const isBare = require('./modules/runtime.js').isBare();
const isBrowser = typeof window !== 'undefined';
const isRN = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// ===== POLYFILLS =====
if (isBare) {
    global.TextEncoder = util.TextEncoder;
    global.TextDecoder = util.TextDecoder;
}

// ===== COMPATIBILITY LAYER =====
if (isBrowser || isRN) require('./modules/compat/sodium').ensureSodiumCompat(); // PBKDF2 ON SODIUM
if (isBrowser) require('./modules/compat/dom').ensureDOMCompat(); // DOM COMPATIBILITY (ONLY FOR BROWSER)


// ===== MODULES =====
const address = require('./modules/address.js');
const hash = require('./modules/hash.js');
const mnemonic = require('./modules/mnemonic.js');
const nonce = require('./modules/nonce.js');
const signature = require('./modules/signature.js');
const data = require('./modules/data.js');
const utils = require('./modules/utils.js');
const transaction = require('./modules/transaction.js');
const operation = require('./modules/operation.js');
const htlc = require('./modules/htlc.js');
const {
    TRAC_NETWORK_MAINNET_ID: MAINNET_ID,
    TRAC_NETWORK_TESTNET_ID: TESTNET_ID
} = require('./constants.js');

// ===== OPTIONAL (browser/RN) =====
const b4a = require('b4a');
const sodium = require('sodium-universal');

// ===== BASE =====
const sign = signature.sign;

// ===== EXPORT OBJECT =====
module.exports = {
    address,
    hash,
    mnemonic,
    nonce,
    signature,
    data,
    utils,
    transaction,
    operation,
    sign,
    htlc,
    MAINNET_ID,
    TESTNET_ID
};

// ===== BROWSER / RN EXTENSIONS =====
if (isBrowser || isRN) {
    module.exports.b4a = b4a;
    module.exports.sodium = sodium;
}

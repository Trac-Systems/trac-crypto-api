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
const constants = require('./constants.js');

// ===== OPTIONAL (browser/RN) =====
let b4a;
let sodium;

try {
    b4a = require('b4a');
} catch {}

try {
    sodium = require('sodium-universal');
} catch {}

// ===== BASE =====
const sign = signature.sign;

// ===== EXPORT OBJECT =====
const exported = {
    address,
    hash,
    mnemonic,
    nonce,
    signature,
    utils,
    transaction,
    operation,
    sign,

    // node/base
    data,
    MAINNET_ID: constants.TRAC_NETWORK_MAINNET_ID,
    TESTNET_ID: constants.TRAC_NETWORK_TESTNET_ID
};

// ===== BROWSER / RN EXTENSIONS =====
if (isBrowser || isRN) {
    if (b4a) exported.b4a = b4a;
    if (sodium) exported.sodium = sodium;
}

module.exports = exported;
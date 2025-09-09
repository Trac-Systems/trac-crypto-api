const sodium = require('sodium-universal');

const TRAC_PUB_KEY_SIZE = sodium.crypto_sign_PUBLICKEYBYTES;
const TRAC_PRIV_KEY_SIZE = sodium.crypto_sign_SECRETKEYBYTES;
const TRAC_SIGNATURE_SIZE = sodium.crypto_sign_BYTES;
const TRAC_NONCE_SIZE = 32;
const TRAC_MNEMONIC_WORD_COUNT = 24;

module.exports = {
    TRAC_PUB_KEY_SIZE,
    TRAC_PRIV_KEY_SIZE,
    TRAC_SIGNATURE_SIZE,
    TRAC_NONCE_SIZE,
    TRAC_MNEMONIC_WORD_COUNT
};

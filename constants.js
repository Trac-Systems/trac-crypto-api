const sodium = require('sodium-universal');

const TRAC_PUB_KEY_SIZE = sodium.crypto_sign_PUBLICKEYBYTES;
const TRAC_PRIV_KEY_SIZE = sodium.crypto_sign_SECRETKEYBYTES;
const TRAC_SIGNATURE_SIZE = sodium.crypto_sign_BYTES;
const TRAC_MNEMONIC_WORD_COUNT = 24;

const TRAC_NONCE_SIZE = 32;
const TRAC_HASH_SIZE = 32;

const TRAC_TOKEN_AMOUNT_SIZE_BYTES = 16; // 128 bits / 16 bytes
const TRAC_VALIDITY_SIZE_BYTES = 32; // 256 bits / 32 bytes

module.exports = {
    TRAC_PUB_KEY_SIZE,
    TRAC_PRIV_KEY_SIZE,
    TRAC_SIGNATURE_SIZE,
    TRAC_MNEMONIC_WORD_COUNT,
    TRAC_NONCE_SIZE,
    TRAC_HASH_SIZE,
    TRAC_TOKEN_AMOUNT_SIZE_BYTES,
    TRAC_VALIDITY_SIZE_BYTES
};

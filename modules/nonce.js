const sodium = require('sodium-universal');
const b4a = require('b4a');
const { TRAC_NONCE_SIZE } = require('../constants.js');

/**
 * Generates a random nonce with high entrophy.
 * 
 * @returns {Buffer} A securely generated 32-byte nonce as a Buffer.
 */
function generate() {
    const nonce = b4a.alloc(TRAC_NONCE_SIZE);
    sodium.randombytes_buf(nonce);
    return nonce;
}

module.exports = {
    generate,
    SIZE: TRAC_NONCE_SIZE
};
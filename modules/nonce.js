import sodium from 'sodium-universal';
import b4a from 'b4a';
import { TRAC_NONCE_SIZE } from '../constants.js';

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

export default {
    generate,
    SIZE: TRAC_NONCE_SIZE
};
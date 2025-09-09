const sodium = require('sodium-universal');
const b4a = require('b4a');
const { TRAC_PRIV_KEY_SIZE, TRAC_SIGNATURE_SIZE } = require('../constants.js');

/**
 * Signs a message with the stored secret key.
 * @param {Buffer} message - The message to sign.
 * @param {Buffer} privateKey - The private key to use for signing.
 * @returns {Buffer} The signature in Buffer format.
 * @throws Will throw an error if the secret key is not set.
 */
function sign(message, privateKey) {
    // TODO: Should we check this or is it out of scope?
    if (!b4a.isBuffer(privateKey) || !b4a.isBuffer(message)) {
        throw new Error('Invalid message or private key format. Expected Buffers.');
    }

    // TODO: Should we also check length or is it out of scope?
    if (privateKey.length !== TRAC_PRIV_KEY_SIZE) {
        throw new Error('Invalid private key length');
    }

    const signature = b4a.alloc(TRAC_SIGNATURE_SIZE);
    sodium.crypto_sign_detached(signature, message, privateKey);
    return signature;
}

/**
* Verifies a message signature.
* @param {Buffer} signature - The signature in hex or Buffer format.
* @param {Buffer} message - The message to verify in string or Buffer.
* @param {Buffer} publicKey - The public key in hex or Buffer format.
* @returns {boolean} True if the signature is valid, false otherwise.
*/
function verify(signature, message, publicKey) {
    try {
        return sodium.crypto_sign_verify_detached(signature, message, publicKey);
    } catch (e) { console.error(e) }
    return false;
}

module.exports = {
    sign,
    verify,
    SIZE: TRAC_SIGNATURE_SIZE
};
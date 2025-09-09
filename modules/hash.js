const { blake3: blake3External } = require("@tracsystems/blake3");
const sodium = require('sodium-universal');
const b4a = require('b4a');

// Observation: The Blake3 hash functions are not currently supported in the browser environment.
// TODO: Implement Blake3 support on browser environment

/**
 * Computes the Blake3 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The Blake3 hash as a Buffer.
 * @throws Will throw an error if the input is not of a supported type.
 */
async function blake3(message) {
    const isBuffer = b4a.isBuffer(message)
    if (!isBuffer && !(message instanceof Uint8Array)) {
        throw new Error('Invalid input: must be a Buffer or Uint8Array');
    }
    const messageBytes = isBuffer ? message : b4a.from(message)
    const hashBytes = await blake3External(messageBytes)
    return b4a.from(hashBytes)
}

/**
 * Computes the Blake3 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The Blake3 hash as a Buffer or an empty buffer in case of error
 */
async function blake3Safe(message){
    try {
        return await blake3(message);
    } catch (err) {
        console.error(err);
    }
    return b4a.alloc(0); // Return an empty buffer on error
}

/**
 * Computes the SHA-256 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The SHA-256 hash as a Buffer.
 * @throws Will throw an error if the input is not of a supported type.
 */
function sha256(message) {
    const isBuffer = b4a.isBuffer(message)
    if (!isBuffer && !(message instanceof Uint8Array)) {
        throw new Error('Invalid input: must be a Buffer or Uint8Array');
    }
    const messageBytes = isBuffer ? message : b4a.from(message)
    const out = b4a.alloc(sodium.crypto_hash_sha256_BYTES);
    sodium.crypto_hash_sha256(out, messageBytes);
    return out;
}

/**
 * Computes the SHA-256 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The SHA-256 hash as a Buffer or an empty buffer in case of error
 */
function sha256Safe(message) {
    try {
        return sha256(message);
    } catch (err) {
        console.error(err);
    }
    return b4a.alloc(0); // Return an empty buffer on error
}

module.exports = {
    blake3,
    blake3Safe,
    sha256,
    sha256Safe
};
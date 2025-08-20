import sodium from 'sodium-universal';
import b4a from 'b4a';

function blake3(message) {
    // TODO
    console.warn('blake3 is not implemented yet');
}

/**
 * Computes the SHA-256 hash of the given message.
 * @param {Buffer | string} message - The input message to hash. Can be a Buffer or string.
 * @returns {Buffer} The SHA-256 hash as a Buffer.
 */
// TODO: TThis will be completely replaced by blake3. Remove this function after Blake3 is functional
function sha256(message) {
    const out = b4a.alloc(sodium.crypto_hash_sha256_BYTES);
    sodium.crypto_hash_sha256(out, b4a.from(message));
    return out;
}

export default {
    blake3,
    sha256
};
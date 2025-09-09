const sodium = require('sodium-universal');
const b4a = require('b4a');

// Observation: The key derivation function `crypto_pwhash` is currently not exposed on
// browser environment, as stated on the README file of sodium-universal: https://github.com/holepunchto/sodium-universal
// This means this entire module is currently not working on browser environment

/**
 * Derives a key from the password and salt using Argon2i.
 * @param {Buffer} password - The password to derive the key from.
 * @param {Buffer} salt - The salt to use for key derivation.
 * @returns {Buffer} The derived key.
 */
function _derive(password, salt) {
    if (!b4a.isBuffer(password) || !b4a.isBuffer(salt)) {
        throw new Error('Password and salt must be buffers');
    }

    const derivedKey = b4a.alloc(sodium.crypto_secretbox_KEYBYTES);
    sodium.crypto_pwhash(
        derivedKey,
        password,
        salt,
        sodium.crypto_pwhash_OPSLIMIT_MODERATE,
        sodium.crypto_pwhash_MEMLIMIT_MODERATE,
        sodium.crypto_pwhash_ALG_ARGON2I13
    );

    return derivedKey;
}


/**
 * Encrypts a message using a password-derived key and returns the encrypted data.
 * @param {Buffer} message - The message to encrypt as a Buffer.
 * @param {Buffer} password - The password to derive the encryption key from, as a Buffer.
 * @returns {{nonce: Buffer, salt: Buffer, ciphertext: Buffer}} The encrypted data object containing nonce, salt, and ciphertext.
 * @throws Will throw if password or message are not Buffers.
 */
function encrypt(message, password) {
    if (!b4a.isBuffer(password)) {
        throw new Error(`Password must be a buffer`);
    }

    if (!b4a.isBuffer(message)) {
        throw new Error('Message must be a Buffer');
    }

    const nonce = b4a.alloc(sodium.crypto_secretbox_NONCEBYTES);
    const salt = b4a.alloc(sodium.crypto_pwhash_SALTBYTES);
    const ciphertext = b4a.alloc(message.length + sodium.crypto_secretbox_MACBYTES);

    sodium.randombytes_buf(nonce);
    sodium.randombytes_buf(salt);
    const key = _derive(password, salt);

    sodium.crypto_secretbox_easy(ciphertext, message, nonce, key);

    return {
        nonce,
        salt,
        ciphertext
    };
}

/**
 * Decrypts encrypted data using a password.
 * @param {{nonce: Buffer, salt: Buffer, ciphertext: Buffer}} data - The encrypted data object.
 * @param {Buffer} password - The password/key as a Buffer
 * @returns {Buffer} The decrypted message Buffer.
 * @throws Will throw if password is not the correct length or if data format is invalid or decryption fails.
 */
function decrypt(data, password) {
    if (!data || !b4a.isBuffer(data.nonce) || !b4a.isBuffer(data.ciphertext) || !b4a.isBuffer(data.salt)) {
        throw new Error('Invalid encrypted data format. Data should have nonce, ciphertext, and salt in buffer format.');
    }

    const key = _derive(password, data.salt);
    const message = b4a.alloc(data.ciphertext.length - sodium.crypto_secretbox_MACBYTES);

    if (!sodium.crypto_secretbox_open_easy(message, data.ciphertext, data.nonce, key)) {
        throw new Error('Failed to decrypt data. Invalid key or corrupted data.');
    }

    return message;
}

module.exports = {
    encrypt,
    decrypt
};
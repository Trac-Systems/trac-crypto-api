const sodium = require('sodium-universal');

function ensureSodiumCompat() {
    if (sodium.extension_pbkdf2_sha512_async) return;

    const cryptoObj =
        (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle)
            ? globalThis.crypto
            : require('crypto').webcrypto;

    sodium.extension_pbkdf2_sha512_async = async (output, input, salt, iterations, keylen) => {
        const keyMaterial = await cryptoObj.subtle.importKey(
            'raw',
            input,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        const derivedBits = await cryptoObj.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt,
                iterations,
                hash: 'SHA-512'
            },
            keyMaterial,
            keylen * 8
        );

        output.set(new Uint8Array(derivedBits));
    };
}

module.exports = {
    sodium,
    ensureSodiumCompat,
};
module.exports = function applySodiumPatch() {
    if (typeof globalThis === 'undefined') return;

    try {
        const sodium = require('sodium-universal');

        let patch;

        if (globalThis.crypto && globalThis.crypto.subtle) {
            patch = async (output, input, salt, iterations, keylen) => {
                const keyMaterial = await globalThis.crypto.subtle.importKey(
                    'raw',
                    input,
                    { name: 'PBKDF2' },
                    false,
                    ['deriveBits']
                );

                const derivedBits = await globalThis.crypto.subtle.deriveBits(
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
        } else {
            const crypto = require('crypto');

            patch = async (output, input, salt, iterations, keylen) => {
                const derived = crypto.pbkdf2Sync(
                    input,
                    salt,
                    iterations,
                    keylen,
                    'sha512'
                );

                output.set(derived);
            };
        }

        sodium.extension_pbkdf2_sha512_async = patch;

        globalThis.sodium = sodium;
        globalThis.sodium.extension_pbkdf2_sha512_async = patch;

    } catch (_) {}
};
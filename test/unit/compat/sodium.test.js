const test = require('brittle');
const sodium = require('sodium-universal');

const { ensureSodiumCompat } = require('../../../modules/compat/sodium');

test('ensureSodiumCompat: should inject pbkdf2 if missing', (t) => {
    const originalPbkdf2 = sodium.extension_pbkdf2_sha512_async;

    delete sodium.extension_pbkdf2_sha512_async;

    ensureSodiumCompat();

    t.is(typeof sodium.extension_pbkdf2_sha512_async, 'function', 'pbkdf2 async compat should be injected');

    if (originalPbkdf2) {
        sodium.extension_pbkdf2_sha512_async = originalPbkdf2;
    } else {
        delete sodium.extension_pbkdf2_sha512_async;
    }
});

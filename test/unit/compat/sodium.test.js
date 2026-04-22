test('ensureSodiumCompat: should inject pbkdf2 if missing', () => {
    const sodium = require('sodium-universal');

    delete sodium.extension_pbkdf2_sha512_async;

    const { ensureSodiumCompat } = require('../../../modules/compat/sodium');
    ensureSodiumCompat();

    expect(typeof sodium.extension_pbkdf2_sha512_async).toBe('function');
});

test('ensureDOMCompat: should not override existing globals', () => {
    global.document = { test: true };

    const { ensureDOMCompat } = require('../../../modules/compat/dom');
    ensureDOMCompat();

    expect(global.document.test).toBe(true);
});
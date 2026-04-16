const { TextEncoder, TextDecoder } = require('util');
const { webcrypto } = require('crypto');

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}

if (!global.crypto || !global.crypto.subtle) {
    global.crypto = webcrypto;
}

if (typeof window !== 'undefined') {
    window.crypto = global.crypto;
}
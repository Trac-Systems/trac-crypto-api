const b4a = require('b4a');
const sodium = require('sodium-universal');

window.b4a = b4a;
window.sodium = sodium;

const TracCryptoApi = require('trac-crypto-api');
window.TracCryptoApi = TracCryptoApi;

Object.defineProperty(global, 'process', {
    value: undefined,
    configurable: true
});

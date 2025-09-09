const sodium = require('sodium-universal');
const b4a = require('b4a');

function memzero(buffer) {
    if (!b4a.isBuffer(buffer)) return; // do nothing
    sodium.sodium_memzero(buffer);
}

module.exports = {
    memzero
};

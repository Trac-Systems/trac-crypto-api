import sodium from 'sodium-universal'
import b4a from 'b4a';

function memzero(buffer) {
    if (!b4a.isBuffer(buffer)) return; // do nothing
    sodium.sodium_memzero(buffer);
}

export default {
    memzero
};

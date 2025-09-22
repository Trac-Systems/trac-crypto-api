const sodium = require('sodium-universal');
const b4a = require('b4a');

function memzero(buffer) {
    if (!b4a.isBuffer(buffer)) return; // do nothing
    sodium.sodium_memzero(buffer);
}

function toBase64(payload) {
    if (typeof payload !== 'object') {
        throw new Error('Payload must be an object');
    }
    const jsonString = JSON.stringify(payload);
    const buffer = b4a.from(jsonString, 'utf-8');
    return buffer.toString('base64');
}

function isUInt32(n) {
    return Number.isInteger(n) && n >= 1 && n <= 0xFFFFFFFF;
}

function toUInt32(value, offset) {
    const buf = b4a.alloc(4);
    buf.writeUInt32BE(value, offset);
    return buf;
}

function isHexString(str) {
    return typeof str === 'string' && /^[0-9a-fA-F]+$/.test(str);
}

function serialize(...args) {
    const buffers = args.map(arg => {
        // TODO: Should we support other types?
        if (b4a.isBuffer(arg)) {
            return arg;
        } else if (typeof arg === 'number' && isUInt32(arg)) {
            // Convert number to 4-byte big-endian buffer
            return toUInt32(arg, 0);
        }
        else {
            throw new Error('Invalid argument type. Only Buffer and uint32 are supported for now');
        }
    }).filter(buf => b4a.isBuffer(buf));

    return b4a.concat(buffers);
}

module.exports = {
    memzero,
    toBase64,
    isUInt32,
    toUInt32,
    isHexString,
    serialize,
};

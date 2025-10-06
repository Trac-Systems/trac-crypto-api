const sodium = require('sodium-universal');
const b4a = require('b4a');
const runtime = require('./runtime.js');

function memzero(buffer) {
    if (!b4a.isBuffer(buffer)) return; // do nothing
    sodium.sodium_memzero(buffer);
}

function toBase64(payload) {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be an object');
    }
    const jsonString = JSON.stringify(payload);
    let encoded;
    if (runtime.isNode() || runtime.isBare()) {
        // Node.js and Bare environment (like Pear) support direct base64 conversion
        // the function btoa (used for browser environment) is deprecated in Node.js
        encoded = b4a.from(jsonString, 'utf-8').toString('base64');
    } else {
        // Convert the byte array to a string and then
        // calling btoa to get a base64 encoding

        // Convert string to Uint8Array
        const utf8Bytes = new TextEncoder().encode(jsonString);

        // Convert Uint8Array to binary string
        let binary = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
            binary += String.fromCharCode(utf8Bytes[i]);
        }

        // Finally, encode the binary string to base64
        encoded = btoa(binary);
    }
    return encoded;
}

function isUInt32(n) {
    return Number.isInteger(n) && n >= 0 && n <= 0xFFFFFFFF;
}

function toUInt32(value, offset) {
    const buf = b4a.alloc(4);
    b4a.writeUInt32BE(buf, value, offset);
    return buf;
}

function isHexString(str) {
    return typeof str === 'string' && /^[0-9a-fA-F]+$/.test(str);
}

function toHexString(buf) {
    let hexStr = '';
    if (runtime.isNode() || runtime.isBare()) {
        hexStr = buf.toString('hex');
    } else {
        console.log("TYPEOF BUF: ", typeof buf, buf);
        for (let i = 0; i < buf.length; i++) {
            const hex = buf[i].toString(16).padStart(2, '0');
            hexStr += hex;
        }
    }
    return hexStr.toLowerCase();
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
    toHexString,
    serialize,
};

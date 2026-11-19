const b4a = require("b4a");
const addressUtils = require("../address.js");
const utils = require("../utils.js");

function _validateBuffer(value, field, expectedLength, allowZero = false) {
    if (!b4a.isBuffer(value)) {
        throw new Error(`Invalid "${field}": expected a Buffer`);
    }

    if (value.length === 0) {
        throw new Error(`Invalid "${field}" byte length: must not be empty`);
    }

    if (expectedLength !== undefined && value.length !== expectedLength) {
        throw new Error(`Invalid "${field}" byte length: expected ${expectedLength}`);
    }

    if (!allowZero && value.every(byte => byte === 0)) {
        throw new Error(`Invalid "${field}": must not be zero-filled`);
    }
}

function hexToBuffer(value, field, expectedLength, allowZero = false) {
    if (!utils.isHexString(value) || value.length % 2 !== 0) {
        throw new Error(`Invalid "${field}": expected an even-length hex string`);
    }

    const buffer = b4a.from(value, 'hex');
    _validateBuffer(buffer, field, expectedLength, allowZero);
    return buffer;
}

// Prepared hashes, nonces and private keys are buffers. Copy them before asynchronous hashing.
function copyBuffer(value, field, expectedLength) {
    _validateBuffer(value, field, expectedLength);
    const buffer = b4a.alloc(value.length);
    buffer.set(value);
    return buffer;
}

function normalizeIntegerHex(value, field, size, allowZero = false) {
    if (!utils.isHexString(value) || value.length > size * 2) {
        throw new Error(`Invalid "${field}": expected a hex string up to ${size} bytes`);
    }
    const paddedHex = value.padStart(size * 2, '0');
    const buffer = hexToBuffer(paddedHex, field, size, allowZero);
    return utils.toHexString(buffer);
}

function validateAddress(value, field, prefix) {
    if (!addressUtils.isValid(value) || !addressUtils.canDecode(value)) {
        throw new Error(`Invalid "${field}" address`);
    }

    if (prefix !== undefined && !value.startsWith(`${prefix}1`)) {
        throw new Error(`Invalid "${field}" address prefix`);
    }

    const publicKey = addressUtils.decode(value);
    if (publicKey.every(byte => byte === 0)) {
        throw new Error(`Invalid "${field}": zero public key`);
    }
}

function validateNetworkId(networkId) {
    if (!utils.isUInt32(networkId) || networkId === 0) {
        throw new Error('Invalid "networkId": expected a non-zero uint32');
    }
}

function validateObject(value, field) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`Invalid "${field}": expected an object`);
    }
}

function validatePreparedData(data) {
    validateObject(data, 'data');
    if (data.nonce === undefined || data.networkId === undefined) {
        throw new Error('Expected prepared HTLC data with nonce and networkId');
    }
}

module.exports = {
    hexToBuffer,
    copyBuffer,
    normalizeIntegerHex,
    validateAddress,
    validateNetworkId,
    validateObject,
    validatePreparedData,
};

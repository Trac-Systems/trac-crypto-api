const b4a = require("b4a");
const utils = require("./utils.js");
const nonceUtils = require("./nonce.js");
const hashUtils = require("./hash.js");
const signatureUtils = require("./signature.js");
const addressUtils = require("./address.js");
const { TRAC_VALIDITY_SIZE_BYTES, TRAC_NETWORK_MAINNET_ID } = require("../constants.js");

const OP_TYPE_TX = 12; // Operation type for a transaction in Trac Network

function _isValidInput(input, expectedLength) {
    return utils.isHexString(input) && input.length === expectedLength;
}

const _bufferToHexString = (buf) => {
    return utils.toHexString(buf);
}

/**
 * Builds an unsigned transaction message.
 * @async
 * @param {string} from - The sender's address.
 * @param {string} validator - The subnetwork validator writing key as a hex string.
 * @param {string} contentHash - The content hash as a hex string.
 * @param {string} originBootstrap - The origin bootstrap node as a hex string.
 * @param {string} destinationBootstrap - The destination bootstrap node as a hex string.
 * @param {string} validity - The Trac Network current indexer hash as a hex string.
 * @param {number} [networkId=TRAC_NETWORK_MAINNET_ID] - The network ID (defaults to mainnet).
 * @returns {Promise<Object>} Resolves to the transaction data object containing from, validator, contentHash, originBootstrap, destinationBootstrap, validity, nonce, and hash.
 * @throws Will throw an error if any of the inputs are invalid.
 */
async function preBuild(from, validator, contentHash, originBootstrap, destinationBootstrap, validity, networkId = TRAC_NETWORK_MAINNET_ID) {
    // validate inputs
    if (!addressUtils.isValid(from) || !addressUtils.canDecode(from)) {
        throw new Error('Invalid "from" address format');
    }
    if (!_isValidInput(validator, 64)) {
        throw new Error('Invalid "writerKey" format. Should be a 32-byte hex string');
    }
    if (!_isValidInput(contentHash, 64)) {
        throw new Error('Invalid "contentHash" format. Should be a 32-byte hex string');
    }
    if (!_isValidInput(originBootstrap, 64)) {
        throw new Error('Invalid "originBootstrap" format. Should be a 32-byte hex string');
    }
    if (!_isValidInput(destinationBootstrap, 64)) {
        throw new Error('Invalid "destinationBootstrap" format. Should be a 32-byte hex string');
    }
    if (!_isValidInput(validity, 64) || validity.length !== TRAC_VALIDITY_SIZE_BYTES * 2) {
        throw new Error(`Invalid "validity" format. Should be a ${TRAC_VALIDITY_SIZE_BYTES}-byte hex string`);
    }

    // Generate serialized operation
    // TODO: In the future, return a serialized transaction and implement a "descerialize" function
    // that can be used to extract the fields from the serialized transaction
    // This will ensure that the transaction is properly formatted and can be used for signing
    // and sending to the network
    // For now, we just return an object with the fields
    const nonce = nonceUtils.generate();
    const serialized = utils.serialize(
        networkId,
        b4a.from(validity, 'hex'),
        b4a.from(validator, 'hex'),
        b4a.from(contentHash, 'hex'),
        b4a.from(originBootstrap, 'hex'),
        b4a.from(destinationBootstrap, 'hex'),
        nonce,
        OP_TYPE_TX
    );

    const hash = await hashUtils.blake3(serialized);

    const txData = {
        networkId, // number
        hash, // Buffer
        from, // string
        validity, // string
        validator, // string
        contentHash, // string
        originBootstrap, // string
        destinationBootstrap, // string
        nonce, // Buffer
    };

    return txData;
}

/**
 * Builds a signed operation message. This function does NOT perform any validation on the received data.
 * It is assumed that the operation data has been properly generated with the preBuild function.
 * @param {Object} operationData - The operation data object returned by preBuild function.
 * @param {Buffer} secretKey - The private key to sign the operation with.
 * @returns {string} The signed operation as a Base64 string.
 */
function build(operationData, secretKey) {
    // sign the hash with the private key
    const sig = signatureUtils.sign(operationData.hash, secretKey);

    // assemble the final transaction object
    const data = {
        type: OP_TYPE_TX,
        address: operationData.from,
        txo: {
            tx: _bufferToHexString(operationData.hash),
            txv: operationData.validity,
            iw: operationData.validator,
            ch: operationData.contentHash,
            bs: operationData.originBootstrap,
            mbs: operationData.destinationBootstrap,
            in: _bufferToHexString(operationData.nonce),
            is: _bufferToHexString(sig),
        }
    }

    return utils.toBase64(data);
}

module.exports = {
    preBuild,
    build,
    OP_TYPE_TX
};
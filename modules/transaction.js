const b4a = require("b4a");
const nonceUtils = require("./nonce.js");
const hashUtils = require("./hash.js");
const signatureUtils = require("./signature.js");
const addressUtils = require("./address.js");
const { TRAC_TOKEN_AMOUNT_SIZE_BYTES, TRAC_VALIDITY_SIZE_BYTES } = require("../constants.js");

const OP_TYPE_TRANSFER = 13; // Operation type for a transaction in Trac Network

function _isHexString(str) {
    return typeof str === 'string' && /^[0-9a-fA-F]+$/.test(str);
}

function _isUInt32(n) { return Number.isInteger(n) && n >= 1 && n <= 0xFFFFFFFF; }

function _writeUInt32BE(value, offset) {
    const buf = b4a.alloc(4);
    buf.writeUInt32BE(value, offset);
    return buf;
}

function _createMessage(...args) {

    if (args.length === 0) return b4a.alloc(0);

    const buffers = args.map(arg => {
        if (b4a.isBuffer(arg)) {
            return arg;
        } else if (typeof arg === 'number' && _isUInt32(arg)) {
            // Convert number to 4-byte big-endian buffer
            return _writeUInt32BE(arg, 0);
        }
    }).filter(buf => b4a.isBuffer(buf));

    if (buffers.length === 0) return b4a.alloc(0);
    return b4a.concat(buffers);
}

/**
 * Builds an unsigned transaction message.
 * @param {string} from - The sender's address.
 * @param {string} to - The recipient's address.
 * @param {string} amount - The amount to transfer as a hex string.
 * @param {string} validity - The Trac Network current indexer hash as a hex string.
 */
async function preBuild(from, to, amount, validity) {
    // validate inputs
    if (!addressUtils.isValid(from)) {
        throw new Error('Invalid "from" address format');
    }
    if (!addressUtils.isValid(to)) {
        throw new Error('Invalid "to" address format');
    }
    if (!_isHexString(amount) || amount.length > TRAC_TOKEN_AMOUNT_SIZE_BYTES * 2) {
        throw new Error(`Invalid "amount" format. Should be a hex string up to ${TRAC_TOKEN_AMOUNT_SIZE_BYTES} bytes long`);
    }
    if (!_isHexString(validity) || validity.length !== TRAC_VALIDITY_SIZE_BYTES * 2) {
        throw new Error(`Invalid "validity" format. Should be a ${TRAC_VALIDITY_SIZE_BYTES}-byte hex string`);
    }

    // Generate transaction object
    const nonce = nonceUtils.generate();
    const amountBuf = b4a.from(amount, 'hex');
    const amountPadded = amountBuf.length < TRAC_TOKEN_AMOUNT_SIZE_BYTES ?
        b4a.concat([b4a.alloc(TRAC_TOKEN_AMOUNT_SIZE_BYTES - amountBuf.length, 0), amountBuf]) :
        amountBuf;
    const message = _createMessage(
        addressUtils.toBuffer(from),
        b4a.from(validity, 'hex'),
        nonce,
        addressUtils.toBuffer(to),
        amountPadded,
        OP_TYPE_TRANSFER
    );
    const hash = await hashUtils.blake3(message);
    const txData = {
        from,
        to,
        amount: amountPadded.toString('hex'),
        validity,
        nonce,
        hash,
    };

    return txData;
}

/**
 * Builds a signed transaction message. This function does NOT perform any validation on the transaction data.
 * It is assumed that the transaction data has been properly generated with the preBuild function.
 * @param {Object} transactionData - The transaction data object returned by preBuild function.
 * @param {Buffer} secretKey - The private key to sign the transaction with.
 * @returns {Buffer} The signed transaction message.
 */
function build(transactionData, secretKey) {
    // sign the hash with the private key
    const sig = signatureUtils.sign(transactionData.hash, secretKey);

    const payload = {
        type: OP_TYPE_TRANSFER,
        address: transactionData.from,
        tro: {
            tx: transactionData.hash.toString('hex'),
            txv: transactionData.validity,
            in: transactionData.nonce.toString('hex'),
            to: transactionData.to,
            am: transactionData.amount,
            is: sig.toString('hex')
        }
    }

    return payload;
}

module.exports = {
    preBuild,
    build,
    OP_TYPE_TRANSFER
};
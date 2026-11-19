const b4a = require("b4a");
const utils = require("../utils.js");
const nonceUtils = require("../nonce.js");
const hashUtils = require("../hash.js");
const signatureUtils = require("../signature.js");
const addressUtils = require("../address.js");
const validation = require("./validation.js");
const {
    TRAC_NETWORK_MAINNET_ID,
    TRAC_HASH_SIZE,
    TRAC_NONCE_SIZE,
    TRAC_PRIV_KEY_SIZE,
    TRAC_VALIDITY_SIZE_BYTES,
} = require("../../constants.js");

const OP_TYPE_HTLC_REFUND = 19;

/**
 * Builds an unsigned HTLC refund. MSB checks whether the refund epoch is reached.
 * @async
 * @param {string} from - The submitter's address.
 * @param {string} lockId - The 32-byte lock transaction hash as a hex string.
 * @param {string} validity - The current 32-byte transaction-validity reference as a hex string.
 * @param {number} [networkId=TRAC_NETWORK_MAINNET_ID] - The network ID.
 * @param {Object} [options={}] - Optional preparation settings.
 * @param {string} [options.nonce] - The 32-byte nonce as a hex string for reproducible signing.
 * @returns {Promise<Object>} The refund data, including hash and nonce as buffers.
 */
async function preBuild(from, lockId, validity, networkId = TRAC_NETWORK_MAINNET_ID, options = {}) {
    // Validate inputs
    validation.validateObject(options, 'options');
    validation.validateNetworkId(networkId);
    validation.validateAddress(from, 'from');

    const validityBuffer = validation.hexToBuffer(validity, 'validity', TRAC_VALIDITY_SIZE_BYTES);
    const lockIdBuffer = validation.hexToBuffer(lockId, 'lockId', TRAC_HASH_SIZE);
    const nonceHex = options.nonce === undefined ? utils.toHexString(nonceUtils.generate()) : options.nonce;
    const nonce = validation.hexToBuffer(nonceHex, 'nonce', TRAC_NONCE_SIZE);

    // Serialize the fields in MSB signing order
    const message = utils.serialize(
        networkId,
        validityBuffer,
        lockIdBuffer,
        nonce,
        OP_TYPE_HTLC_REFUND
    );
    const hash = await hashUtils.blake3(message);

    return {
        networkId, // number
        hash, // Buffer
        from, // string
        lockId: utils.toHexString(lockIdBuffer), // string
        validity: utils.toHexString(validityBuffer), // string
        nonce, // Buffer
    };
}

/**
 * Verifies the prepared refund and signs it with the submitter's private key.
 * @async
 * @param {Object} refundData - The refund data returned by preBuild.
 * @param {Buffer} secretKey - The submitter's private key.
 * @returns {Promise<string>} Base64 JSON for POST /v1/htlc/:lockId/refund.
 */
async function build(refundData, secretKey) {
    // Rebuild using the original nonce to check that the signed fields did not change
    validation.validatePreparedData(refundData);
    const expectedHash = validation.copyBuffer(refundData.hash, 'hash', TRAC_HASH_SIZE);
    const signingKey = validation.copyBuffer(secretKey, 'secretKey', TRAC_PRIV_KEY_SIZE);
    const nonce = validation.copyBuffer(refundData.nonce, 'nonce', TRAC_NONCE_SIZE);
    const preparedData = await preBuild(
        refundData.from,
        refundData.lockId,
        refundData.validity,
        refundData.networkId,
        { nonce: utils.toHexString(nonce) }
    );

    if (!b4a.equals(preparedData.hash, expectedHash)) {
        throw new Error('HTLC data does not match its hash; run preBuild again and collect new signatures');
    }

    // Sign the hash with the private key
    const sig = signatureUtils.sign(preparedData.hash, signingKey);
    const publicKey = addressUtils.decode(preparedData.from);
    if (!signatureUtils.verify(sig, preparedData.hash, publicKey)) {
        throw new Error('Secret key does not match the HTLC submitter address');
    }

    // Assemble the final refund object
    const data = {
        type: OP_TYPE_HTLC_REFUND,
        address: preparedData.from,
        hro: {
            tx: utils.toHexString(preparedData.hash),
            txv: preparedData.validity,
            li: preparedData.lockId,
            in: utils.toHexString(preparedData.nonce),
            is: utils.toHexString(sig),
        }
    };

    return utils.toBase64(data);
}

module.exports = {
    preBuild,
    build,
    OP_TYPE_HTLC_REFUND,
};

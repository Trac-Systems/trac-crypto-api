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
    TRAC_PUB_KEY_SIZE,
    TRAC_SIGNATURE_SIZE,
    TRAC_VALIDITY_SIZE_BYTES,
    TRAC_TOKEN_AMOUNT_SIZE_BYTES,
    TRAC_HTLC_EPOCH_SIZE_BYTES,
    TRAC_HTLC_MAX_SIGNERS,
    TRAC_HTLC_METADATA_MAX_SIZE_BYTES,
} = require("../../constants.js");

const OP_TYPE_HTLC_LOCK = 17;
const MAX_AMOUNT = (1n << 128n) - 1n;

function _normalizeSignerSet(signerSet, lockerPublicKey) {
    if (signerSet === undefined) {
        signerSet = [utils.toHexString(lockerPublicKey)];
    }
    if (!Array.isArray(signerSet) || signerSet.length < 1 || signerSet.length > TRAC_HTLC_MAX_SIGNERS) {
        throw new Error(`signerSet must contain between 1 and ${TRAC_HTLC_MAX_SIGNERS} public keys`);
    }

    const signerKeys = Array.from(signerSet, publicKey => {
        return validation.hexToBuffer(publicKey, 'signerSet key', TRAC_PUB_KEY_SIZE);
    });

    if (!b4a.equals(signerKeys[0], lockerPublicKey)) {
        throw new Error('signerSet[0] must be the locker public key');
    }

    const uniqueKeys = new Set(signerKeys.map(utils.toHexString));
    if (uniqueKeys.size !== signerKeys.length) {
        throw new Error('signerSet must not contain duplicate keys');
    }

    // The locker stays first. Only the remaining keys must be sorted.
    for (let index = 2; index < signerKeys.length; index++) {
        if (b4a.compare(signerKeys[index - 1], signerKeys[index]) >= 0) {
            throw new Error('Cosigner keys must be sorted by raw bytes');
        }
    }

    return signerKeys;
}

function _validateCosignerSignatures(signatures, transactionHash, signerSet, threshold) {
    if (signatures.length > signerSet.length - 1) {
        throw new Error('Cosigner signatures cannot outnumber the cosigner keys');
    }
    if (1 + signatures.length < threshold) {
        throw new Error('Not enough signatures for the HTLC threshold');
    }

    // Match signatures in signer-set order. Optional cosigners may be skipped.
    let signerIndex = 1;
    for (const signature of signatures) {
        let matched = false;

        while (signerIndex < signerSet.length) {
            const publicKey = b4a.from(signerSet[signerIndex], 'hex');
            signerIndex++;

            if (signatureUtils.verify(signature, transactionHash, publicKey)) {
                matched = true;
                break;
            }
        }

        if (!matched) {
            throw new Error('Invalid cosigner signature or signer-set order');
        }
    }
}

/**
 * Builds an unsigned HTLC lock before collecting signatures. Its hash is the lock ID.
 * @async
 * @param {string} from - The locker's address.
 * @param {Object} lockTerms - The lock terms described below.
 * @param {string} lockTerms.claimAddress - The recipient of the principal on claim.
 * @param {string} lockTerms.refundAddress - The recipient of all escrowed funds on refund.
 * @param {string} lockTerms.amount - The principal in base units as a hex string, up to 16 bytes.
 * @param {string} lockTerms.hashLock - The 32-byte SHA-256 hash of the preimage as a hex string.
 * @param {string} lockTerms.refundEpoch - The MSB refund epoch as a hex string, up to 8 bytes.
 * @param {string} [lockTerms.feeAmount='0'] - The additional fee in base units as a hex string, up to 16 bytes.
 * @param {string} [lockTerms.feeRecipient] - Required exactly when feeAmount is non-zero.
 * @param {string} [lockTerms.metadata] - Opaque application bytes as a hex string (1–1024 bytes).
 * @param {string[]} [lockTerms.signerSet] - Public keys as 32-byte hex strings; locker first, then sorted cosigners.
 * @param {number} [lockTerms.threshold=1] - The required signature count, including the locker.
 * @param {string} [lockTerms.nonce] - Optional 32-byte nonce as a hex string for reproducible signing.
 * @param {string} validity - The current 32-byte transaction-validity reference as a hex string.
 * @param {number} [networkId=TRAC_NETWORK_MAINNET_ID] - The network ID.
 * @returns {Promise<Object>} The normalized lock terms, including hash and nonce as buffers.
 */
async function preBuild(from, lockTerms, validity, networkId = TRAC_NETWORK_MAINNET_ID) {
    // Validate inputs
    validation.validateObject(lockTerms, 'lockTerms');
    validation.validateNetworkId(networkId);
    validation.validateAddress(from, 'from');

    const prefix = from.slice(0, from.indexOf('1'));
    validation.validateAddress(lockTerms.claimAddress, 'claimAddress', prefix);
    validation.validateAddress(lockTerms.refundAddress, 'refundAddress', prefix);

    const amountHex = validation.normalizeIntegerHex(lockTerms.amount, 'amount', TRAC_TOKEN_AMOUNT_SIZE_BYTES);
    const feeAmountInput = lockTerms.feeAmount === undefined ? '0' : lockTerms.feeAmount;
    const feeAmountHex = validation.normalizeIntegerHex(feeAmountInput, 'feeAmount', TRAC_TOKEN_AMOUNT_SIZE_BYTES, true);
    const totalAmount = BigInt(`0x${amountHex}`) + BigInt(`0x${feeAmountHex}`);
    if (totalAmount > MAX_AMOUNT) {
        throw new Error('HTLC amount plus feeAmount exceeds uint128');
    }

    const hasFee = BigInt(`0x${feeAmountHex}`) !== 0n;
    const hasFeeRecipient = lockTerms.feeRecipient !== undefined;
    if (hasFee !== hasFeeRecipient) {
        throw new Error('feeRecipient must be present exactly when feeAmount is non-zero');
    }
    if (hasFeeRecipient) {
        validation.validateAddress(lockTerms.feeRecipient, 'feeRecipient', prefix);
    }

    const validityBuffer = validation.hexToBuffer(validity, 'validity', TRAC_VALIDITY_SIZE_BYTES);
    const hashLockBuffer = validation.hexToBuffer(lockTerms.hashLock, 'hashLock', TRAC_HASH_SIZE);
    const refundEpochHex = validation.normalizeIntegerHex(lockTerms.refundEpoch, 'refundEpoch', TRAC_HTLC_EPOCH_SIZE_BYTES);
    const nonceHex = lockTerms.nonce === undefined ? utils.toHexString(nonceUtils.generate()) : lockTerms.nonce;
    const nonce = validation.hexToBuffer(nonceHex, 'nonce', TRAC_NONCE_SIZE);

    let metadataBuffer = b4a.alloc(0);
    const hasMetadata = lockTerms.metadata !== undefined;
    if (hasMetadata) {
        metadataBuffer = validation.hexToBuffer(lockTerms.metadata, 'metadata', undefined, true);
        if (metadataBuffer.length > TRAC_HTLC_METADATA_MAX_SIZE_BYTES) {
            throw new Error(`HTLC metadata must not exceed ${TRAC_HTLC_METADATA_MAX_SIZE_BYTES} bytes`);
        }
    }

    // Validate the signer set and threshold. Signatures are collected after preBuild.
    const lockerPublicKey = addressUtils.decode(from);
    const signerKeys = _normalizeSignerSet(lockTerms.signerSet, lockerPublicKey);
    const threshold = lockTerms.threshold === undefined ? 1 : lockTerms.threshold;
    if (!Number.isInteger(threshold) || threshold < 1 || threshold > signerKeys.length) {
        throw new Error('threshold must be between 1 and signerSet.length');
    }

    // Serialize the fields in MSB signing order
    const fromBuffer = addressUtils.toBuffer(from);
    const claimAddress = lockTerms.claimAddress;
    const refundAddress = lockTerms.refundAddress;
    const feeRecipient = lockTerms.feeRecipient;
    const feeRecipientBuffer = hasFeeRecipient
        ? addressUtils.toBuffer(feeRecipient)
        : b4a.alloc(fromBuffer.length);

    const message = utils.serialize(
        networkId,
        fromBuffer,
        validityBuffer,
        addressUtils.toBuffer(claimAddress),
        addressUtils.toBuffer(refundAddress),
        b4a.from(amountHex, 'hex'),
        b4a.from(feeAmountHex, 'hex'),
        feeRecipientBuffer,
        hashLockBuffer,
        b4a.from(refundEpochHex, 'hex'),
        metadataBuffer.length,
        metadataBuffer,
        b4a.from([signerKeys.length]),
        ...signerKeys,
        b4a.from([threshold]),
        nonce,
        OP_TYPE_HTLC_LOCK
    );
    const hash = await hashUtils.blake3(message);

    const lockData = {
        networkId, // number
        hash, // Buffer
        from, // string
        claimAddress, // string
        refundAddress, // string
        amount: amountHex, // string
        feeAmount: feeAmountHex, // string
        hashLock: utils.toHexString(hashLockBuffer), // string
        refundEpoch: refundEpochHex, // string
        signerSet: signerKeys.map(utils.toHexString), // string[]
        threshold, // number
        validity: utils.toHexString(validityBuffer), // string
        nonce, // Buffer
    };

    if (hasFeeRecipient) {
        lockData.feeRecipient = feeRecipient;
    }
    if (hasMetadata) {
        lockData.metadata = utils.toHexString(metadataBuffer);
    }

    return lockData;
}

/**
 * Verifies the prepared lock and cosigner signatures, then signs with the locker's key.
 * @async
 * @param {Object} lockData - The lock data returned by preBuild.
 * @param {Buffer} secretKey - The locker's private key.
 * @param {string[]} [cosignerSignatures=[]] - Signatures of the lock hash as 64-byte hex strings
 * in signer-set order. Optional cosigners may be skipped without placeholders.
 * @returns {Promise<string>} Base64 JSON for POST /v1/htlc.
 */
async function build(lockData, secretKey, cosignerSignatures = []) {
    // Copy inputs before asynchronous hashing
    validation.validatePreparedData(lockData);
    const expectedHash = validation.copyBuffer(lockData.hash, 'hash', TRAC_HASH_SIZE);
    const signingKey = validation.copyBuffer(secretKey, 'secretKey', TRAC_PRIV_KEY_SIZE);
    const nonce = validation.copyBuffer(lockData.nonce, 'nonce', TRAC_NONCE_SIZE);

    if (!Array.isArray(cosignerSignatures) || cosignerSignatures.length > TRAC_HTLC_MAX_SIGNERS - 1) {
        throw new Error('Cosigner signatures cannot outnumber the cosigner keys');
    }
    const signatures = Array.from(cosignerSignatures, signature => {
        return validation.hexToBuffer(signature, 'cosigner signature', TRAC_SIGNATURE_SIZE);
    });

    // Rebuild using the original nonce to check that the signed fields did not change
    const preparedData = await preBuild(
        lockData.from,
        { ...lockData, nonce: utils.toHexString(nonce) },
        lockData.validity,
        lockData.networkId
    );
    if (!b4a.equals(preparedData.hash, expectedHash)) {
        throw new Error('HTLC data does not match its hash; run preBuild again and collect new signatures');
    }

    _validateCosignerSignatures(signatures, preparedData.hash, preparedData.signerSet, preparedData.threshold);

    // Sign the hash with the locker's private key
    const sig = signatureUtils.sign(preparedData.hash, signingKey);
    const publicKey = addressUtils.decode(preparedData.from);
    if (!signatureUtils.verify(sig, preparedData.hash, publicKey)) {
        throw new Error('Secret key does not match the HTLC submitter address');
    }

    // Assemble the final lock object
    const data = {
        type: OP_TYPE_HTLC_LOCK,
        address: preparedData.from,
        hlo: {
            tx: utils.toHexString(preparedData.hash),
            txv: preparedData.validity,
            ca: preparedData.claimAddress,
            ra: preparedData.refundAddress,
            am: preparedData.amount,
            fa: preparedData.feeAmount,
            hl: preparedData.hashLock,
            re: preparedData.refundEpoch,
            ss: preparedData.signerSet,
            th: utils.toHexString(b4a.from([preparedData.threshold])),
            cs: signatures.map(utils.toHexString),
            in: utils.toHexString(preparedData.nonce),
            is: utils.toHexString(sig),
        }
    };

    if (preparedData.feeRecipient !== undefined) {
        data.hlo.fr = preparedData.feeRecipient;
    }
    if (preparedData.metadata !== undefined) {
        data.hlo.md = preparedData.metadata;
    }

    return utils.toBase64(data);
}

module.exports = {
    preBuild,
    build,
    OP_TYPE_HTLC_LOCK,
};

import mnemonicUtils from './mnemonic.js';
import hashUtils from './hash.js';
import sodium from 'sodium-universal';
import { bech32m } from 'bech32';
import b4a from 'b4a';
import { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } from '../constants.js';

/**
 * Generates an Ed25519 key pair from a mnemonic.
 * @async
 * @param {string|null} mnemonic - Optional BIP39 mnemonic phrase. If not provided, a new one is generated.
 * @returns {Promise<{publicKey: Buffer, secretKey: Buffer, mnemonic: string}>} Resolves to an object containing the public key, secret key, and mnemonic used.
 */
async function _generateKeyPair(mnemonic = null) {
    let safeMnemonic;
    if (!mnemonic) {
        safeMnemonic = mnemonicUtils.generate();
    } else {
        safeMnemonic = mnemonicUtils.sanitize(mnemonic); // Will throw if the mnemonic is invalid
    }

    const seed = await mnemonicUtils.toSeed(safeMnemonic);

    const publicKey = b4a.alloc(TRAC_PUB_KEY_SIZE);
    const secretKey = b4a.alloc(TRAC_PRIV_KEY_SIZE);

    const seed32 = hashUtils.sha256(seed);

    sodium.crypto_sign_seed_keypair(publicKey, secretKey, seed32);

    return {
        publicKey,
        secretKey,
        mnemonic: safeMnemonic
    };
}

/**
 * Encodes a public key Buffer into a bech32m address string.
 * @param {string} hrp - The human-readable part (HRP) for the address (prefix).
 * @param {Buffer} publicKey - The buffer to encode.
 * @returns {string} The bech32m encoded address.
 * @throws Will throw an error if the publicKey is not a Buffer or not 32 bytes.
 */
function encode(hrp, publicKey) {
    if (!b4a.isBuffer(publicKey) || publicKey.length !== TRAC_PUB_KEY_SIZE) {
        throw new Error(`Invalid public key. Expected a Buffer of length ${TRAC_PUB_KEY_SIZE}, got ${publicKey.length}`);
    }
    const words = bech32m.toWords(publicKey);
    return bech32m.encode(hrp, words);
}

/**
 * Decodes a bech32m address string into a 32-byte public key Buffer.
 * @param {string} address - The bech32m encoded address.
 * @returns {Buffer} The decoded public key buffer.
 * @throws Will throw an error if the decoded buffer is not 32 bytes.
 */
function decode(address) {
    const { words } = bech32m.decode(address);
    const buffer = b4a.from(bech32m.fromWords(words));
    if (buffer.length !== TRAC_PUB_KEY_SIZE) {
        throw new Error(`Decoded buffer is invalid. Expected ${TRAC_PUB_KEY_SIZE} bytes, got ${buffer.length} bytes`);
    }
    return buffer;
}

async function generate(hrp, mnemonic = null) {
    const keypair = await _generateKeyPair(mnemonic);
    const address = encode(hrp, keypair.publicKey);
    return {
        address,
        publicKey: keypair.publicKey,
        secretKey: keypair.secretKey,
        mnemonic: keypair.mnemonic
    };
}

export default {
    generate,
    encode,
    decode
};

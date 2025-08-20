import { generateMnemonic, validateMnemonic, mnemonicToSeed, normalizeMnemonic } from 'bip39-mnemonic';
import b4a from 'b4a';

/**
 * Sanitizes and validates a mnemonic phrase.
 * @param {string} mnemonic - The mnemonic phrase to sanitize.
 * @returns {string|null} The sanitized mnemonic or null if the input is invalid.
 * @throws Will throw an error if the mnemonic is invalid.
 */
function sanitize(mnemonic) {
    const normalized = normalizeMnemonic(mnemonic);
    if (!validateMnemonic(normalized)) {
        throw new Error('Invalid mnemonic phrase');
    }
    return normalized;
}

/**
 * Generates a new mnemonic phrase.
 * @param {Buffer|string|null} [seed] - Optional seed to use as entropy. If null, a random seed will be generated.
 * @returns {string} The generated mnemonic phrase.
 * @throws Will throw an error if the seed is invalid.
 */
function generate(seed = null) {
    const options = () => {
        const seedBuffer = b4a.from(seed);
        return {
            entropy: seedBuffer,
            language: 'english'
        }
    }
    return generateMnemonic(seed ? options() : undefined);
}


/**
 * Converts a mnemonic phrase to a seed buffer.
 * @param {string} mnemonic - The mnemonic phrase to convert.
 * @param {string} [passphrase=''] - Optional passphrase to add extra security.
 * @returns {Buffer} The derived seed buffer.
 */
// TODO: Implement a sync version of this function
async function toSeed(mnemonic, passphrase = '') {
    // There is no need to sanitize the mnemonic here,
    // as the `mnemonicToSeed` function will handle validation.
    return mnemonicToSeed(mnemonic, passphrase);
}

export default {
    sanitize,
    generate,
    toSeed
};
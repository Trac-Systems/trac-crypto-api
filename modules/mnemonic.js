const { generateMnemonic, validateMnemonic, mnemonicToSeed, normalizeMnemonic } = require('bip39-mnemonic');
const b4a = require('b4a');
const { TRAC_MNEMONIC_WORD_COUNT } = require('../constants.js');

function _isString(input) {
    return typeof input === 'string';
}

function _isMnemonicFormat(mnemonic) {
    const words = mnemonic.split(' ');
    return TRAC_MNEMONIC_WORD_COUNT.includes(words.length);
}

/**
 * Validates a mnemonic phrase for correct word count and word validity.
 * @param {string} mnemonic - The mnemonic phrase to validate.
 * @returns {boolean} True if the mnemonic is valid and has the correct number of words, false otherwise.
 */
function isValid(mnemonic) {
    if (!_isString(mnemonic) || !_isMnemonicFormat(mnemonic)) {
        return false;
    }
    return validateMnemonic(mnemonic);
}

/**
 * Sanitizes and validates a mnemonic phrase.
 * @param {string} mnemonic - The mnemonic phrase to sanitize.
 * @returns {string|null} The sanitized mnemonic or null if the input is invalid.
 */
function sanitize(mnemonic) {
    if (!_isString(mnemonic)) {
        return null;
    }

    const normalized = normalizeMnemonic(mnemonic);
    if (!_isMnemonicFormat(normalized) || !validateMnemonic(normalized)) {
        return null;
    }
    return normalized;
}

/**
 * Generates a new 24 word mnemonic phrase.
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

module.exports = {
    validate: isValid,
    isValid,
    sanitize,
    generate,
    toSeed,
};
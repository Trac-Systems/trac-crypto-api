const mnemonicUtils = require("./mnemonic.js");
const hashUtils = require("./hash.js");
const sodium = require("sodium-universal");
const { bech32m } = require("bech32");
const b4a = require("b4a");
const { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } = require("../constants.js");
const runtime = require('which-runtime');

let SLIP10Node;
if (runtime.isBare) {
  SLIP10Node = require('@metamask/key-tree', { with: { imports: '../package.json' } }).SLIP10Node;
  const util = require('util');
  globalThis.TextEncoder = util.TextEncoder;
  globalThis.TextDecoder = util.TextDecoder;
} else {
  SLIP10Node = require('@metamask/key-tree').SLIP10Node;
}

/**
 * Validates a BIP32-style derivation path string (e.g. "m/0'/1'/2'") and assembles 
 * an array of SLIP-10 path segments.
 * @param {string} path - The BIP32-style derivation path string to validate.
 * @returns {string[]} Array of SLIP-10 path segments.
 * @throws {TypeError|Error} If the path is invalid.
 */
function _sanitizeDerivationPath(path) {
  // Validate input type
  if (typeof path !== 'string') {
    throw new TypeError('Derivation path must be a string');
  }
  // Remove all spaces from the input path
  path = path.replace(/\s+/g, '');

  // Must start with 'm/'
  // Observation: Although 'm' is not necessary for SLIP-10, 
  // we enforce it for clarity and consistency with BIP32
  if (!path.startsWith('m/')) {
    throw new Error("Derivation path must start with 'm/'");
  }

  // Disallow empty and invalid segments
  const segments = path.split('/').map(seg => seg.trim());
  segments.shift(); // Remove initial 'm' and process segments separately

  if (segments.length < 1) {
    throw new Error('Derivation path must have at least one child segment');
  }

  const segmentRegex = /^\d+'$/;
  let slip10Segments = [];
  for (const seg of segments) {
    if (!segmentRegex.test(seg)) {
      throw new Error(`Invalid segment: '${seg}'. Only hardened segments (e.g. 0') are supported.`);
    }
    slip10Segments.push(`slip10:${seg}`);
  }

  return slip10Segments;
}

/**
 * Generates an Ed25519 key pair from a mnemonic phrase.
 * @async
 * @param {string|null} mnemonic - Optional BIP39 mnemonic phrase. If not provided, a new one is generated.
 * @param {string} [path="m/0'/0'/0'"] - Optional derivation path. Defaults to "m/0'/0'/0'".
 * @returns {Promise<{publicKey: Buffer, secretKey: Buffer, mnemonic: string}>} Resolves to an object containing the public key, secret key, and mnemonic used.
 */
async function _generateKeyPair(mnemonic = null, path = "m/0'/0'/0'") {
  let safeMnemonic;
  if (mnemonic === null) {
    safeMnemonic = mnemonicUtils.generate();
  } else {
    safeMnemonic = mnemonicUtils.sanitize(mnemonic); // Will throw if the mnemonic is invalid
  }

  const masterNode = await SLIP10Node.fromDerivationPath({
    curve: 'ed25519',
    derivationPath: [`bip39:${safeMnemonic}`, `slip10:0'`],
  });

  const childNode = await masterNode.derive(_sanitizeDerivationPath(path));

  // Observation:
  // libsodium uses a 64-byte secret key (32-byte seed + 32-byte public key)
  // @metamask/key-tree, in turn, uses a 32-byte private key
  // In order to keep consistency between key derivation and signing, we concatenate the private key with the public key here.
  // More info here:
  // https://libsodium.gitbook.io/doc/public-key_cryptography/public-key_signatures#generating-a-new-signing-key-pair
  const publicKey = b4a.from(childNode.publicKeyBytes.subarray(1)); // Remove prefix byte 0x00
  const secretKey = b4a.concat([b4a.from(childNode.privateKeyBytes), publicKey]);

  // Sanity checks. Maybe not necessary, but better safe than sorry.
  if (publicKey.length !== TRAC_PUB_KEY_SIZE) {
    throw new Error(`Derived public key has invalid length. Expected ${TRAC_PUB_KEY_SIZE}, got ${publicKey.length}`);
  }
  if (secretKey.length !== TRAC_PRIV_KEY_SIZE) {
    throw new Error(`Derived secret key has invalid length. Expected ${TRAC_PRIV_KEY_SIZE}, got ${secretKey.length}`);
  }

  return {
    publicKey,
    secretKey,
    mnemonic: safeMnemonic,
  };
}

/**
 * Encodes a public key Buffer into a bech32m address string.
 * @param {string} hrp - The human-readable part (HRP) for the address (prefix).
 * @param {Buffer} publicKey - The buffer to encode.
 * @returns {string} The bech32m encoded address.
 * @throws {Error} If the publicKey is not a Buffer or has incorrect length.
 */
function encode(hrp, publicKey) {
  if (!b4a.isBuffer(publicKey) || publicKey.length !== TRAC_PUB_KEY_SIZE) {
    throw new Error(
      `Invalid public key. Expected a Buffer of length ${TRAC_PUB_KEY_SIZE}, got ${publicKey.length}`
    );
  }
  const words = bech32m.toWords(publicKey);
  return bech32m.encode(hrp, words);
}

/**
 * Decodes a bech32m address string into a 32-byte public key Buffer.
 * @param {string} address - The bech32m encoded address.
 * @returns {Buffer} The decoded public key buffer.
 * @throws {Error} If the decoded buffer has incorrect length.
 */
function decode(address) {
  const { words } = bech32m.decode(address);
  const buffer = b4a.from(bech32m.fromWords(words));
  if (buffer.length !== TRAC_PUB_KEY_SIZE) {
    throw new Error(
      `Decoded buffer is invalid. Expected ${TRAC_PUB_KEY_SIZE} bytes, got ${buffer.length} bytes`
    );
  }
  return buffer;
}


/**
 * Generates a new keypair and address.
 * @param {string} hrp - The human-readable part (HRP) for the address (prefix).
 * @param {string} [mnemonic] - Optional BIP39 mnemonic phrase. If not provided, a new one is generated.
 * @returns {Promise<{address: string, publicKey: Buffer, secretKey: Buffer, mnemonic: string}>} Resolves to an object containing the address, public key, secret key, and mnemonic used.
 */
async function generate(hrp, mnemonic = undefined, derivationPath = undefined) {
  const keypair = await _generateKeyPair(mnemonic, derivationPath);
  const address = encode(hrp, keypair.publicKey);
  return {
    address,
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey,
    mnemonic: keypair.mnemonic,
  };
}

module.exports = {
  generate,
  encode,
  decode,
  PUB_KEY_SIZE: TRAC_PUB_KEY_SIZE,
  PRIV_KEY_SIZE: TRAC_PRIV_KEY_SIZE,
};

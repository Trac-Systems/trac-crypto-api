const mnemonicUtils = require("./mnemonic.js");
const { bech32m } = require("bech32");
const b4a = require("b4a");
const { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } = require("../constants.js");
const runtime = require('./runtime.js');

// Note: The HRP size limit is 83 characters according to BIP-173,
// but we enforce a more restrictive limit of 31 characters here
// to ensure the total address length does not exceed 90 characters,
// which is a common maximum length for bech32 addresses.
// After this limit of 90 characters per address, the checksum
// effectiveness starts to decrease
// See: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki#checksum-design
const HRP_SIZE_LIMIT = 31;
const DEFAULT_DERIVATION_PATH = "m/918'/0'/0'/0'";

let SLIP10Node;

function loadSLIP10Node() {
  if (SLIP10Node) return SLIP10Node;

  try {
    if (runtime.isBare && runtime.isBare()) {
      // Use eval to hide from bundler (webpack react-native)
      const req = eval("require");
      const keyTree = req("@metamask/key-tree", {
        with: { imports: "../package.json" },
      });
      SLIP10Node = keyTree.SLIP10Node;

      // Polyfill
      const util = req("util");
      globalThis.TextEncoder = util.TextEncoder;
      globalThis.TextDecoder = util.TextDecoder;
      return SLIP10Node;
    }

    // Browser / RN / Node
    SLIP10Node = require("@metamask/key-tree").SLIP10Node;
    return SLIP10Node;
  } catch (err) {
    throw new Error(`[trac-crypto-api] Failed to load @metamask/key-tree: ${err.message}`);
  }
}

/**
 * Checks if a given HRP (Human Readable Part) is valid.
 * @param {string} hrp - The HRP to validate.
 * @returns {boolean} True if the HRP is valid, false otherwise.
 */
function _isValidHrp(hrp) {
  // HRP must be a non-empty string with length between 1 and HRP_SIZE_LIMIT characters
  if (typeof hrp !== 'string' || hrp.length < 1 || hrp.length > HRP_SIZE_LIMIT) {
    return false;
  }
  // HRP must consist of printable lower-case ASCII characters (33-126)
  for (let i = 0; i < hrp.length; i++) {
    const charCode = hrp.charCodeAt(i);
    // Only allow lower-case letters a-z
    if (charCode < 97 || charCode > 122) {
      return false;
    }
  }
  return true;
}

function _validateHrp(hrp) {
  if (!_isValidHrp(hrp)) {
    throw new Error(`Invalid HRP. It must be a non-empty string with length between 1 and ${HRP_SIZE_LIMIT} characters, consisting of lowercase characters a-z.`);
  }
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

  return { safePath: path, slip10Segments };
}

/**
 * Generates an Ed25519 key pair from a mnemonic phrase.
 * @async
 * @param {Buffer} masterPathSegments - The master path segments as a Buffer (e.g. derived from HRP).
 * @param {string|null} [mnemonic] - Optional BIP39 mnemonic phrase. If not provided, a new one is generated.
 * @param {string} [path] - Optional derivation path. Defaults to "m/918'/0'/0'/0'".
 * @returns {Promise<{publicKey: Buffer, secretKey: Buffer, mnemonic: string}>} Resolves to an object containing the public key, secret key, and mnemonic used.
 */
async function _generateKeyPair(masterPathSegments, mnemonic = null, path = null) {
  const node = loadSLIP10Node();

  let safeMnemonic;
  if (mnemonic === null) {
    safeMnemonic = mnemonicUtils.generate();
  } else {
    safeMnemonic = mnemonicUtils.sanitize(mnemonic); // Will throw if the mnemonic is invalid
  }

  if (path === null) {
    path = DEFAULT_DERIVATION_PATH;
  }

  let masterPath = [`bip39:${safeMnemonic}`];
  for (let i = 0; i < masterPathSegments.length; i++) {
    masterPath.push(`slip10:${masterPathSegments[i]}'`);
  }

  const masterNode = await node.fromDerivationPath({
    curve: 'ed25519',
    derivationPath: masterPath,
  });

  const { safePath, slip10Segments } = _sanitizeDerivationPath(path);
  const childNode = await masterNode.derive(slip10Segments);

  // Observation:
  // libsodium uses a 64-byte secret key (32-byte seed + 32-byte public key)
  // @metamask/key-tree, in turn, uses a 32-byte private key
  // In order to keep consistency between key derivation and signing, we concatenate the private key with the public key here.
  // More info here:
  // https://libsodium.gitbook.io/doc/public-key_cryptography/public-key_signatures#generating-a-new-signing-key-pair
  const publicKey = b4a.from(childNode.publicKeyBytes.subarray(1)); // Remove compressed public key prefix byte (always 0x00)
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
    derivationPath: safePath,
  };
}

/**
 * Checks if a given address is a valid TRAC bech32m address.
 * Note that we only check the format and length, not the checksum.
 * So, it is possible that even if an address is considered valid,
 * it may not be a real address on the network.
 * @param {string} address - The address to validate.
 * @returns {boolean} True if the address is valid, false otherwise.
 */
function isValid(address) {
  const _separateHrp = (address) => {
    let ret = { prefix: null, suffix: null };
    if (typeof address === 'string') {
      const separatorIndex = address.indexOf('1');
      if (separatorIndex > -1) {
        ret.prefix = address.slice(0, separatorIndex);
        ret.suffix = address.slice(separatorIndex + 1);
      }
    }
    return ret;
  };

  const bech32Chars = /^[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+$/;
  const { prefix, suffix } = _separateHrp(address);
  const suffixLength = Math.ceil((TRAC_PUB_KEY_SIZE * 8) / 5) + 6; // Data part + checksum

  return typeof prefix === 'string' &&
    typeof suffix === 'string' &&
    _isValidHrp(prefix) &&
    bech32Chars.test(suffix) &&
    suffix.length === suffixLength;
}

/**
 * Converts a valid Trac address string to buffer format.
 * @param {string} address - The Trac address to convert.
 * @returns {Buffer} The buffer representation of the address.
 */
function toBuffer(address) {
  if (!isValid(address)) {
    throw new Error('Invalid address');
  }
  return b4a.from(address, 'ascii');
}

function fromBuffer(buffer) {
  if (!b4a.isBuffer(buffer)) {
    throw new Error('Invalid input: buffer must be a Buffer');
  }
  return buffer.toString('ascii');
}

/**
 * Encodes a public key Buffer into a bech32m address string.
 * @param {string} hrp - The human-readable part (HRP) for the address (prefix).
 * @param {Buffer} publicKey - The buffer to encode.
 * @returns {string} The bech32m encoded address.
 * @throws {Error} If the publicKey is not a Buffer or has incorrect length.
 */
function encode(hrp, publicKey) {
  _validateHrp(hrp);
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
 * Safely decodes a bech32m address string into a 32-byte public key Buffer.
 * @param {string} address - The bech32m encoded address.
 * @returns {Buffer|null} The decoded public key buffer, or null if decoding fails.
 */
function decodeSafe(address) {
  try {
    return decode(address);
  } catch (err) {
    return null;
  }
}


/**
 * @async
 * Generates a new keypair and address.
 * @param {string} hrp - The human-readable part (HRP) for the address (prefix).
 * @param {string} [mnemonic] - Optional BIP39 mnemonic phrase. If not provided, a new one is generated.
 * @returns {Promise<{address: string, publicKey: Buffer, secretKey: Buffer, mnemonic: string}>} Resolves to an object containing the address, public key, secret key, and mnemonic used.
 */
async function generate(hrp, mnemonic = null, derivationPath = null) {
  _validateHrp(hrp);
  const masterPathSegments = b4a.from(hrp, 'utf8'); // The master path segments used in address generation are derived from the HRP
  const keypair = await _generateKeyPair(masterPathSegments, mnemonic, derivationPath);
  const address = encode(hrp, keypair.publicKey);
  return {
    address,
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey,
    mnemonic: keypair.mnemonic,
    derivationPath: keypair.derivationPath,
  };
}

/**
 * Generates an address and keypair from a given secret key.
 * @param {string} hrp - The human-readable part (HRP) for the address (prefix).
 * @param {Buffer} secretKey - The 64-byte secret key Buffer.
 * @returns {{address: string, publicKey: Buffer, secretKey: Buffer}} An object containing the address, public key, and secret key.
 * @throws {Error} If the secretKey is not a Buffer or has incorrect length.
 */
function fromSecretKey(hrp, secretKey) {
  if (!b4a.isBuffer(secretKey) || secretKey.length !== TRAC_PRIV_KEY_SIZE) {
    throw new Error(
      `Invalid secret key. Expected a Buffer of length ${TRAC_PRIV_KEY_SIZE}, got ${secretKey.length}`
    );
  }
  const publicKey = secretKey.subarray(32); // The public key is the last 32 bytes of the 64-byte secret key
  const address = encode(hrp, publicKey);
  return {
    address,
    publicKey,
    secretKey,
  };
}

function size(hrp) {
  if (!_isValidHrp(hrp)) {
    throw new Error('Invalid HRP. It must be a non-empty string with length between 1 and 83 characters, consisting of printable ASCII characters.');
  }
  const hrpSize = hrp.length;
  const separatorSize = 1; // The '1' character separating HRP and data part
  // Each byte is represented by 8 bits, and bech32m encodes 5 bits per character
  const dataPartSize = Math.ceil((TRAC_PUB_KEY_SIZE * 8) / 5);
  const checksumSize = 6; // Bech32m checksum is always 6 characters

  return hrpSize + separatorSize + dataPartSize + checksumSize;
}

module.exports = {
  generate,
  encode,
  decode,
  decodeSafe,
  size,
  isValid,
  toBuffer,
  fromBuffer,
  fromSecretKey,
  PUB_KEY_SIZE: TRAC_PUB_KEY_SIZE,
  PRIV_KEY_SIZE: TRAC_PRIV_KEY_SIZE,
  DEFAULT_DERIVATION_PATH,
};
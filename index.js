const runtime = require("./modules/runtime.js");
const util = require("util");

// ===== ENV DETECTION =====
const isBare = runtime.isBare();
const isBrowser = typeof window !== "undefined";
const isRN =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

// ===== POLYFILLS =====
if (isBare) {
  global.TextEncoder = util.TextEncoder;
  global.TextDecoder = util.TextDecoder;
}

if (isBrowser) {
  if (typeof location === "undefined") {
    globalThis.location = { href: "" };
  }

  if (typeof document === "undefined") {
    globalThis.document = { currentScript: { src: "" } };
  }
}

// ===== MODULES =====
const address = require("./modules/address.js");
const hash = require("./modules/hash.js");
const mnemonic = require("./modules/mnemonic.js");
const nonce = require("./modules/nonce.js");
const signature = require("./modules/signature.js");
const data = require("./modules/data.js");
const utils = require("./modules/utils.js");
const transaction = require("./modules/transaction.js");
const operation = require("./modules/operation.js");
const constants = require("./constants.js");

// ===== OPTIONAL (browser/RN) =====
let b4a;
let sodium;

try {
  b4a = require("b4a");
} catch {}

try {
  sodium = require("sodium-universal");
} catch {}

// ===== BASE EXPORT =====
const sign = signature.sign;

const api = {
  address,
  hash,
  mnemonic,
  nonce,
  signature,
  utils,
  transaction,
  operation,
  sign,
};

// ===== NODE EXPORTS =====
api.data = data;
api.MAINNET_ID = constants.TRAC_NETWORK_MAINNET_ID;
api.TESTNET_ID = constants.TRAC_NETWORK_TESTNET_ID;

// ===== BROWSER / RN EXPORTS =====
if (isBrowser || isRN) {
  if (b4a) api.b4a = b4a;
  if (sodium) api.sodium = sodium;
}

module.exports = api;

module.exports.address = api.address;
module.exports.hash = api.hash;
module.exports.mnemonic = api.mnemonic;
module.exports.nonce = api.nonce;
module.exports.signature = api.signature;
module.exports.data = api.data;
module.exports.utils = api.utils;
module.exports.transaction = api.transaction;
module.exports.operation = api.operation;
module.exports.sign = api.sign;
module.exports.MAINNET_ID = api.MAINNET_ID;
module.exports.TESTNET_ID = api.TESTNET_ID;

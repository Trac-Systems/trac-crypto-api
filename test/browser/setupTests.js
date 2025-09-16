// setupTests.js
const TracCryptoApi = require("trac-crypto-api")
const b4a = require("b4a")
const sodium = require("sodium-universal")
const { TextEncoder, TextDecoder } = require('util')

// Check if TextEncoder is defined and if not, define it
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}

// Check if TextDecoder is defined and if not, define it
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}

// Expose TracCryptoApi and its dependencies to the window object for browser-like testing
window.TracCryptoApi = TracCryptoApi
window.b4a = b4a
window.sodium = sodium
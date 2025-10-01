// hash.js

const b4a = require('b4a')
const sodium = require('sodium-universal')
const runtime = require('./runtime.js') // Used to check for environment

let blake3External

/**
 * Fallback function used when the external BLAKE3 dependency fails to load (e.g., in a React Native build 
 * where the package is native, or in a browser build without proper aliasing).
 */
const blake3ExternalFallback = () => {
    throw new Error('BLAKE3 module is unavailable. Check build configuration (Rollup aliases, Metro resolver) or confirm environment compatibility.')
}

// --- Conditional BLAKE3 Loading Logic ---

if (runtime.isBare()) {
    // 1. BARE ENVIRONMENT: Uses the specific eval syntax required by the bare module loader.
    const modulePath = '@tracsystems/blake3'
    // Use minimal options; adjust if your bare environment requires specific settings.
    const options = '{}'
    try {
        blake3External = eval(`require('${modulePath}', ${options}).blake3`)
    } catch (e) {
        console.error("Failed to load BLAKE3 in Bare environment:", e)
        blake3External = blake3ExternalFallback
    }
} else {
    // 2. NODE/BROWSER/REACT NATIVE: Isolate the standard require that causes build failures.
    try {
        // Use eval(require) to bypass static analysis in bundlers (Metro, Webpack)
        // while allowing the code to function in a standard Node/Browser environment.
        blake3External = eval('require("@tracsystems/blake3").blake3')
    } catch (e) {
        // This catch block executes if the synchronous require fails (e.g., in a
        // React Native environment where the package is native and can't be resolved,
        // or during browser bundling without a proper alias).
        console.error("BLAKE3 native require failed (likely RN/Browser):", e.message)
        blake3External = blake3ExternalFallback
    }
}


/**
 * Computes the Blake3 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The Blake3 hash as a Buffer.
 * @throws Will throw an error if the input is not of a supported type or if BLAKE3 is unavailable.
 */
async function blake3(message) {
    if (blake3External === blake3ExternalFallback) {
        // Explicitly throw the fallback error if the dependency failed to load
        blake3External()
    }

    const isBuffer = b4a.isBuffer(message)
    if (!isBuffer && !(message instanceof Uint8Array)) {
        throw new Error('Invalid input: must be a Buffer or Uint8Array')
    }

    const messageBytes = isBuffer ? message : b4a.from(message)

    // Call the resolved BLAKE3 function
    const hashBytes = await blake3External(messageBytes)

    return b4a.from(hashBytes)
}

/**
 * Computes the Blake3 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The Blake3 hash as a Buffer or an empty buffer in case of error
 */
async function blake3Safe(message) {
    try {
        return await blake3(message)
    } catch (err) {
        console.error(err)
    }
    return b4a.alloc(0) // Return an empty buffer on error
}

/**
 * Computes the SHA-256 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The SHA-256 hash as a Buffer.
 * @throws Will throw an error if the input is not of a supported type.
 */
function sha256(message) {
    const isBuffer = b4a.isBuffer(message)
    if (!isBuffer && !(message instanceof Uint8Array)) {
        throw new Error('Invalid input: must be a Buffer or Uint8Array')
    }
    const messageBytes = isBuffer ? message : b4a.from(message)
    const out = b4a.alloc(sodium.crypto_hash_sha256_BYTES)
    sodium.crypto_hash_sha256(out, messageBytes)
    return out
}

/**
 * Computes the SHA-256 hash of the given message.
 * @param {Buffer | Uint8Array} message - The input message to hash.
 * @returns {Buffer} The SHA-256 hash as a Buffer or an empty buffer in case of error
 */
function sha256Safe(message) {
    try {
        return sha256(message)
    } catch (err) {
        console.error(err)
    }
    return b4a.alloc(0) // Return an empty buffer on error
}

module.exports = {
    blake3,
    blake3Safe,
    sha256,
    sha256Safe
}

// // const tracBlake3 = eval(`require("@tracsystems/blake3")`)
// // const blake3External = tracBlake3.blake3
// const { blake3: blake3External } = require("@tracsystems/blake3")
// const sodium = require('sodium-universal')
// const b4a = require('b4a')

// /**
//  * Computes the Blake3 hash of the given message.
//  * @param {Buffer | Uint8Array} message - The input message to hash.
//  * @returns {Buffer} The Blake3 hash as a Buffer.
//  * @throws Will throw an error if the input is not of a supported type.
//  */
// async function blake3(message) {
//     const isBuffer = b4a.isBuffer(message)
//     if (!isBuffer && !(message instanceof Uint8Array)) {
//         throw new Error('Invalid input: must be a Buffer or Uint8Array')
//     }
//     const messageBytes = isBuffer ? message : b4a.from(message)
//     const hashBytes = await blake3External(messageBytes)
//     return b4a.from(hashBytes)
// }

// /**
//  * Computes the Blake3 hash of the given message.
//  * @param {Buffer | Uint8Array} message - The input message to hash.
//  * @returns {Buffer} The Blake3 hash as a Buffer or an empty buffer in case of error
//  */
// async function blake3Safe(message) {
//     try {
//         return await blake3(message)
//     } catch (err) {
//         console.error(err)
//     }
//     return b4a.alloc(0) // Return an empty buffer on error
// }

// /**
//  * Computes the SHA-256 hash of the given message.
//  * @param {Buffer | Uint8Array} message - The input message to hash.
//  * @returns {Buffer} The SHA-256 hash as a Buffer.
//  * @throws Will throw an error if the input is not of a supported type.
//  */
// function sha256(message) {
//     const isBuffer = b4a.isBuffer(message)
//     if (!isBuffer && !(message instanceof Uint8Array)) {
//         throw new Error('Invalid input: must be a Buffer or Uint8Array')
//     }
//     const messageBytes = isBuffer ? message : b4a.from(message)
//     const out = b4a.alloc(sodium.crypto_hash_sha256_BYTES)
//     sodium.crypto_hash_sha256(out, messageBytes)
//     return out
// }

// /**
//  * Computes the SHA-256 hash of the given message.
//  * @param {Buffer | Uint8Array} message - The input message to hash.
//  * @returns {Buffer} The SHA-256 hash as a Buffer or an empty buffer in case of error
//  */
// function sha256Safe(message) {
//     try {
//         return sha256(message)
//     } catch (err) {
//         console.error(err)
//     }
//     return b4a.alloc(0) // Return an empty buffer on error
// }

// module.exports = {
//     blake3,
//     blake3Safe,
//     sha256,
//     sha256Safe
// }
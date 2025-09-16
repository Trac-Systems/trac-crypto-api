// signature.test.js
const { signature } = require("trac-crypto-api")
const b4a = require("b4a")
const sodium = require("sodium-universal")

test("signature is on window", () => {
  expect(window.TracCryptoApi.signature).toBe(signature)
})

test("b4a is on window", () => {
  expect(window.b4a).toBe(b4a)
})

test("sodium is on window", () => {
  expect(window.sodium).toBe(sodium)
})

test("should sign and verify a message correctly", async () => {

  // Get the crypto modules directly from the window object
  const { sign, verify } = window.TracCryptoApi.signature
  const b4a = window.b4a
  const sodium = window.sodium

  const {
    crypto_sign_keypair,
    crypto_sign_BYTES,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
  } = sodium

  // Create a new Uint8Array for the public key
  const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)

  // Call the keypair function directly
  crypto_sign_keypair(publicKey, secretKey)

  // Create a message using the b4a module
  const message = b4a.from("Hello, World!")

  // Sign the message using the exposed API
  const signature = sign(message, secretKey)

  // Verify the signature
  const isValid = verify(signature, message, publicKey)

  signatureResult = {
    isValid,
    signatureLength: signature.byteLength,
    expectedSignatureLength: crypto_sign_BYTES,
  }

  expect(signatureResult.isValid).toBe(true)
  expect(signatureResult.signatureLength).toBe(
    signatureResult.expectedSignatureLength
  )
})

test("should fail verification for a tampered message", async () => {
  const { sign, verify } = window.TracCryptoApi.signature
  const b4a = window.b4a
  const sodium = window.sodium

  const {
    crypto_sign_keypair,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
  } = sodium

  const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(publicKey, secretKey)

  // Sign the original message
  const originalMessage = b4a.from("This is the original message.")
  const signature = sign(originalMessage, secretKey)

  // Create a tampered message by changing a single character
  const tamperedMessage = b4a.from("This is the original message.")
  tamperedMessage[5] = "a".charCodeAt(0) // Change the 6th character

  // Try to verify the signature with the tampered message
  const verificationResult = verify(signature, tamperedMessage, publicKey)

  // Verification should fail because the message content was changed.
  expect(verificationResult).toBe(false)
})


test("should fail verification when using a wrong public key", async () => {
  const { sign, verify } = window.TracCryptoApi.signature
  const b4a = window.b4a
  const sodium = window.sodium
  const {
    crypto_sign_keypair,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
  } = sodium

  // Generate the correct key pair for signing
  const correctPublicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const correctSecretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(correctPublicKey, correctSecretKey)

  // Generate an incorrect key pair for verification
  const wrongPublicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const wrongSecretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(wrongPublicKey, wrongSecretKey)

  // Sign a message with the correct secret key
  const message = b4a.from("Testing with a wrong key.")
  const signature = sign(message, correctSecretKey)

  // Try to verify the signature with the incorrect public key
  const verificationResult = verify(signature, message, wrongPublicKey)

  // Verification should fail because the public key does not match the secret key.
  expect(verificationResult).toBe(false)
})

test("should fail verification for a tampered signature", async () => {
  const { sign, verify } = window.TracCryptoApi.signature
  const b4a = window.b4a
  const sodium = window.sodium
  const {
    crypto_sign_keypair,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
  } = sodium

  const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(publicKey, secretKey)

  // Sign the message to get a valid signature
  const message = b4a.from("This signature will be tampered with.")
  const signature = sign(message, secretKey)

  // Create a tampered signature by flipping a single bit
  const tamperedSignature = b4a.from(signature) // Create a copy
  tamperedSignature[0] = tamperedSignature[0] ^ 1 // Flip the least significant bit of the first byte

  // Try to verify the message with the tampered signature
  const verificationResult = verify(tamperedSignature, message, publicKey)

  // Verification should fail because the signature has been altered.
  expect(verificationResult).toBe(false)
})
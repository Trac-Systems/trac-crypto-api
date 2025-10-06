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
  const { sign, verify } = window.TracCryptoApi.signature
  const b4a = window.b4a
  const sodium = window.sodium
  const {
    crypto_sign_keypair,
    crypto_sign_BYTES,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
  } = sodium
  const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(publicKey, secretKey)
  const message = b4a.from("Hello, World!")
  const signatureVal = sign(message, secretKey)
  const isValid = verify(signatureVal, message, publicKey)
  const signatureResult = {
    isValid,
    signatureLength: signatureVal.byteLength,
    expectedSignatureLength: crypto_sign_BYTES,
  }
  expect(signatureResult.isValid).toBe(true)
  expect(signatureResult.signatureLength).toBe(signatureResult.expectedSignatureLength)
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
  const originalMessage = b4a.from("This is the original message.")
  const signatureVal = sign(originalMessage, secretKey)
  const tamperedMessage = b4a.from("This is the original message.")
  tamperedMessage[5] = "a".charCodeAt(0)
  const verificationResult = verify(signatureVal, tamperedMessage, publicKey)
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
  const correctPublicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const correctSecretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(correctPublicKey, correctSecretKey)
  const wrongPublicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
  const wrongSecretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)
  crypto_sign_keypair(wrongPublicKey, wrongSecretKey)
  const message = b4a.from("Testing with a wrong key.")
  const signatureVal = sign(message, correctSecretKey)
  const verificationResult = verify(signatureVal, message, wrongPublicKey)
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
  const message = b4a.from("This signature will be tampered with.")
  const signatureVal = sign(message, secretKey)
  const tamperedSignature = b4a.from(signatureVal)
  tamperedSignature[0] = tamperedSignature[0] ^ 1
  const verificationResult = verify(tamperedSignature, message, publicKey)
  expect(verificationResult).toBe(false)
})
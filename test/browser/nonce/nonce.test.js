// nonce.test.js
const { nonce } = require("trac-crypto-api")

test("nonce is on window", () => {
  expect(window.TracCryptoApi.nonce).toBe(nonce)
})

test("should generate a nonce with the correct length in the browser environment", async () => {
  const nonceInNode = nonce.generate()
  const expectedLength = nonceInNode.length

  const nonceInBrowser = await window.TracCryptoApi.nonce.generate()
  const secondNonceInBrowser = await window.TracCryptoApi.nonce.generate()

  const nonceInBrowserArray = new Uint8Array(nonceInBrowser)
  const isUint8Array = nonceInBrowserArray.length === expectedLength && nonceInBrowserArray instanceof Uint8Array

  expect(nonceInBrowser.length).toBe(expectedLength)
  expect(isUint8Array).toBe(true)
  expect(nonceInBrowser.toString()).not.toBe(secondNonceInBrowser)
})

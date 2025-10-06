// mnemonic.test.js
const { mnemonic } = require("trac-crypto-api")

test("mnemonic is on window", () => {
  expect(window.TracCryptoApi.mnemonic).toBe(mnemonic)
})

test("mnemonic generates a phrase", async () => {
  const phrase = await mnemonic.generate()
  expect(typeof phrase).toBe("string")
  expect(phrase.split(" ").length).toBeGreaterThan(5)
})

test("should generate a mnemonic in the browser environment", async () => {
  const mnemonicInBrowser = window.TracCryptoApi.mnemonic
  const generated = await mnemonicInBrowser.generate()
  expect(typeof generated).toBe("string")
  expect(generated.split(" ").length).toBe(24)
})

test("should sanitize a mnemonic phrase in the browser using direct evaluation", async () => {
  const mnemonicInBrowser = window.TracCryptoApi.mnemonic
  const expectedPhrase = await mnemonicInBrowser.generate()
  const sabotagedPhrase = expectedPhrase.replaceAll(" ", "   ").toUpperCase()
  const sanitizedMnemonic = await mnemonicInBrowser.sanitize(sabotagedPhrase)
  expect(sanitizedMnemonic).toBe(expectedPhrase)
})

test("should return null for a wrong mnemonic", async () => {
  const mnemonicInBrowser = window.TracCryptoApi.mnemonic
  const sabotagedPhrase = "wrong mnemonic phrase"
  const sanitizedMnemonic = await mnemonicInBrowser.sanitize(sabotagedPhrase)
  expect(sanitizedMnemonic).toBe(null)
})
// utils.test.js
const { utils } = require("trac-crypto-api")
const b4a = require("b4a")

test("utils is on window", () => {
  expect(window.TracCryptoApi.utils).toBe(utils)
})

test("b4a is on window", () => {
  expect(window.b4a).toBe(b4a)
})

test("should correctly zero out a buffer in the browser", async () => {
  const { memzero } = window.TracCryptoApi.utils
  const b4a = window.b4a
  const buffer = b4a.alloc(16)
  buffer.fill(0xff)
  memzero(buffer)
  const isZeroed = buffer.every((byte) => byte === 0)
  expect(isZeroed).toBe(true)
})

test("should not change a non-buffer object in the browser", async () => {
  const { memzero } = window.TracCryptoApi.utils
  const nonBuffer = { a: 1, b: "test" }
  const originalValue = JSON.stringify(nonBuffer)
  memzero(nonBuffer)
  const isUnchanged = JSON.stringify(nonBuffer) === originalValue
  expect(isUnchanged).toBe(true)
})

test("should correctly convert an object to a base64 string in the browser", async () => {
  const { toBase64 } = window.TracCryptoApi.utils
  const obj = { key: "value", number: 42, hex: "1234567890abcdef" }
  const base64String = toBase64(obj)
  const jsonString = atob(base64String)
  const decodedObj = JSON.parse(jsonString)
  expect(decodedObj).toEqual(obj)
  expect(decodedObj.key).toBe("value")
  expect(decodedObj.number).toBe(42)
  expect(decodedObj.hex).toBe("1234567890abcdef")
});
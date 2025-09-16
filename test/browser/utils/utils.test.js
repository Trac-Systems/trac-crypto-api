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
  // Access the exposed API from the window object.
  const { memzero } = window.TracCryptoApi.utils
  const b4a = window.b4a

  // Create a buffer and fill it with non-zero values.
  const buffer = b4a.alloc(16)
  buffer.fill(0xff)

  // Call the memzero function.
  memzero(buffer)

  // Return true if all bytes are zero, false otherwise.
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
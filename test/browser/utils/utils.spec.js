import { test, expect } from "playwright/test"
import path from "path"

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe("Memzero Module", () => {
  test.beforeEach(async ({ page }) => {
    await page.addScriptTag({ path: path.resolve(__dirname, "../dist/bundle.umd.cjs") })
  })

  test("should correctly zero out a buffer in the browser", async ({
    page,
  }) => {
    const isZeroed = await page.evaluate(async () => {
      // Access the exposed API from the window object.
      const { memzero } = window.TracCryptoApi

      // The `b4a` module is part of your bundle, so it's available here.
      const b4a = window.TracCryptoApi.b4a

      // Create a buffer and fill it with non-zero values.
      const buffer = b4a.alloc(16)
      buffer.fill(0xff)

      // Call the memzero function.
      memzero(buffer)

      // Return true if all bytes are zero, false otherwise.
      return buffer.every((byte) => byte === 0)
    })

    expect(isZeroed).toBe(true)
  })

  test("should not change a non-buffer object in the browser", async ({
    page,
  }) => {
    const isUnchanged = await page.evaluate(async () => {
      const { memzero } = window.TracCryptoApi

      const nonBuffer = { a: 1, b: "test" }
      const originalValue = JSON.stringify(nonBuffer)

      memzero(nonBuffer)

      return JSON.stringify(nonBuffer) === originalValue
    })

    expect(isUnchanged).toBe(true)
  })
})
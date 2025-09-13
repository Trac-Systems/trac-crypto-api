// import { test, expect } from "playwright/test"
// import path from "path"

// test.describe("Testing modules injection", () => {
//   test.beforeEach(async ({ page }) => {
//     // Load the bundle.
//     await page.addScriptTag({ path: path.resolve(__dirname, "../dist/bundle.umd.cjs") })
//   })
//   test("should have memzero function exposed", async ({ page }) => {
//     const hasMemzero = await page.evaluate(() => {
//       return typeof window.TracCryptoApi?.memzero === "function"
//     })
//     expect(hasMemzero).toBe(true)
//   })

//   test("should have b4a.alloc function exposed on window.TracCryptoApi", async ({ page }) => {
//     const hasB4aAlloc = await page.evaluate(() => {
//       return typeof window.b4a.alloc === "function"
//     })
//     expect(hasB4aAlloc).toBe(true)
//   })
// })

import { test, expect } from "playwright/test";
import allModules from "../../index.js";

test("should generate a mnemonic in the browser environment", async ({
  page,
}) => {
  const mnemonicInNode = allModules.mnemonic.generate();

  const mnemonicInBrowser = await page.evaluate((mnemonic) => {
    return mnemonic;
  }, mnemonicInNode);

  expect(typeof mnemonicInBrowser).toBe("string");
  expect(mnemonicInBrowser.split(" ").length).toBe(24);
});

test("should sanitize a mnemonic phrase in the browser using direct evaluation", async ({
  page,
}) => {
  // Expose the sanitize function to the browser's window object
  await page.exposeFunction("sanitizeInBrowser", allModules.mnemonic.sanitize);

  const expectedPhrase = allModules.mnemonic.generate();
  const sabotagedPhrase = expectedPhrase.replaceAll(" ", "   ").toUpperCase();

  const sanitizedMnemonic = await page.evaluate((mnemonic) => {
    // This code runs in the browser context
    return window.sanitizeInBrowser(mnemonic);
  }, sabotagedPhrase);

  expect(sanitizedMnemonic).toBe(expectedPhrase);
});

test("should throw an error while sanitizing a wrong mnemonic", async ({
  page,
}) => {
  // Expose the sanitize function to the browser's window object
  await page.exposeFunction("sanitizeInBrowser", allModules.mnemonic.sanitize);
  const sabotagedPhrase = "wrong mnemonic phrase";

  // Expect an error to be thrown when sanitizing an invalid mnemonic
  await expect(
    page.evaluate((mnemonic) => {
      return window.sanitizeInBrowser(mnemonic);
    }, sabotagedPhrase)
  ).rejects.toThrow("Invalid mnemonic phrase");
});

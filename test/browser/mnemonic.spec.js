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

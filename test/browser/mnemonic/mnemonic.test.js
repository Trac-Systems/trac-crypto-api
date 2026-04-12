// mnemonic.test.js
const apiReq = require("trac-crypto-api");
const b4a = require("b4a");

const mnemonic = window.TracCryptoApi.mnemonic;
const TRAC_MNEMONIC_WORD_COUNT = window.TracCryptoApi.constants
  ?.TRAC_MNEMONIC_WORD_COUNT || [12, 24];

const mnemonic12Words =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const mnemonic11Words =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";

test("mnemonic is on window", () => {
  expect(window.TracCryptoApi.mnemonic).toBe(apiReq.mnemonic);
});

test("mnemonic.generate: should generate a valid mnemonic", () => {
  const phrase = mnemonic.generate();
  expect(typeof phrase).toBe("string");
  expect(phrase).not.toBe("");
  expect(TRAC_MNEMONIC_WORD_COUNT.includes(phrase.split(" ").length)).toBe(
    true,
  );
});

test("mnemonic.generate: should generate different mnemonics", () => {
  const phrase1 = mnemonic.generate();
  const phrase2 = mnemonic.generate();
  expect(phrase1).not.toBe(phrase2);
});

test("mnemonic.isValid: should return true for a valid mnemonic", () => {
  const phrase24 = mnemonic.generate();
  expect(mnemonic.isValid(phrase24)).toBe(true);
  expect(mnemonic.isValid(mnemonic12Words)).toBe(true);
});

test("mnemonic.isValid: should return false for an invalid mnemonic", () => {
  expect(mnemonic.isValid("invalid mnemonic phrase")).toBe(false);
});

test("mnemonic.isValid: should return false for empty input", () => {
  expect(mnemonic.isValid("")).toBe(false);
  expect(mnemonic.isValid(null)).toBe(false);
});

test("mnemonic.isValid: should return false for wrong word count", () => {
  expect(mnemonic.isValid(mnemonic11Words)).toBe(false);
});

test("mnemonic.sanitize: should sanitize and validate mnemonic", () => {
  const phrase = mnemonic.generate();
  const sanitized = mnemonic.sanitize(phrase);
  expect(sanitized).toBe(phrase);
});

test("mnemonic.sanitize: should return null for invalid input", () => {
  expect(mnemonic.sanitize("")).toBe(null);
  expect(mnemonic.sanitize(undefined)).toBe(null);
  expect(mnemonic.sanitize({})).toBe(null);
  expect(mnemonic.sanitize(1234)).toBe(null);
  expect(mnemonic.sanitize(null)).toBe(null);
});

test("mnemonic.sanitize: should return null for wrong word count", () => {
  expect(mnemonic.sanitize(mnemonic11Words)).toBe(null);
});

test("mnemonic.sanitize: should return null on invalid mnemonic", () => {
  expect(mnemonic.sanitize("invalid mnemonic phrase")).toBe(null);
});

// IMPORTANT: toSeed is NOT supported in browser (sodium limitation)
test("mnemonic.toSeed: should not be supported in browser", async () => {
  const phrase = mnemonic.generate();

  await expect(mnemonic.toSeed(phrase)).rejects.toThrow();
});

test("mnemonic.toSeed: should throw on invalid mnemonic", async () => {
  await expect(mnemonic.toSeed("invalid mnemonic phrase")).rejects.toThrow();
});

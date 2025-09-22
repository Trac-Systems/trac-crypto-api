const test = require("brittle");
const mnemonic = require("../../../modules/mnemonic.js");
const { TRAC_MNEMONIC_WORD_COUNT } = require("../../../constants.js");

const mnemonic12Words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const mnemonic11Words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";
const mnemonic24Words = mnemonic.generate();

test("mnemonic.generate: should generate a valid mnemonic", (t) => {
  const phrase = mnemonic.generate();
  t.is(typeof phrase, "string");
  t.not(phrase, "");
  t.ok(TRAC_MNEMONIC_WORD_COUNT.includes(phrase.split(" ").length));
});

test("mnemonic.generate: should generate different mnemonics", (t) => {
  const phrase1 = mnemonic.generate();
  const phrase2 = mnemonic.generate();
  t.not(phrase1, phrase2);
});

test("mnemonic.isValid: should return true for a valid mnemonic", (t) => {
  t.is(mnemonic.isValid(mnemonic24Words), true);
  t.is(mnemonic.isValid(mnemonic12Words), true);
});

test("mnemonic.isValid: should return false for an invalid mnemonic", (t) => {
  t.is(mnemonic.isValid("invalid mnemonic phrase"), false);
});

test("mnemonic.isValid: should return false for empty input", (t) => {
  t.is(mnemonic.isValid(""), false);
  t.is(mnemonic.isValid(null), false);
});

test("mnemonic.isValid: should return false for wrong word count", (t) => {
  t.is(mnemonic.isValid(mnemonic11Words), false);
});

test("mnemonic.sanitize: should sanitize and validate mnemonic", (t) => {
  const phrase = mnemonic.generate();
  const sanitized = mnemonic.sanitize(phrase);
  t.is(sanitized, phrase);
});

test("mnemonic.sanitize: should return null for invalid input", (t) => {
  t.is(mnemonic.sanitize(""), null);
  t.is(mnemonic.sanitize(undefined), null);
  t.is(mnemonic.sanitize({}), null);
  t.is(mnemonic.sanitize(1234), null);
  t.is(mnemonic.sanitize(null), null);
});

test("mnemonic.sanitize: should return null for wrong word count", (t) => {
  t.is(mnemonic.sanitize(mnemonic11Words), null);
});

test("mnemonic.sanitize: should return null on invalid mnemonic", (t) => {
  t.is(mnemonic.sanitize("invalid mnemonic phrase"), null);
});

test("mnemonic.toSeed: should convert mnemonic to seed", async (t) => {
  const phrase = mnemonic.generate();
  const seed = await mnemonic.toSeed(phrase);
  t.ok(Buffer.isBuffer(seed));
  t.ok(seed.length > 0);
});

test("mnemonic.toSeed: should throw on invalid mnemonic", async (t) => {
  try {
    await mnemonic.toSeed("invalid mnemonic phrase");
    t.fail();
  } catch {
    t.pass();
  }
});

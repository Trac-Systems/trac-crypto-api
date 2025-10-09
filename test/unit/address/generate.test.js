const test = require("brittle");
const api = require("../../../index.js");
const { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } = require("../../../constants.js");
const b4a = require("b4a");
const { bech32m } = require("bech32");

const HRP = "trac";
const PATH1 = "m/0'/1'/2'";
const PATH2 = "m/0'/1'/10000000'";

const mnemonic12Words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"; // 12 words
const mnemonic24Words = api.mnemonic.generate();

test("address.generate: should generate a valid address and keypair with no mnemonic input", async (t) => {
  const result = await api.address.generate(HRP);
  t.is(typeof result.address, "string");
  t.ok(b4a.isBuffer(result.publicKey));
  t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE);
  t.ok(b4a.isBuffer(result.secretKey));
  t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE);
  t.is(typeof result.mnemonic, "string");
  t.is(typeof result.derivationPath, "string");
  t.is(result.derivationPath, "m/0'/0'/0'");
});

test("address.generate: should generate keypair for 12 words mnemonic", async (t) => {
  const mnemonic = mnemonic12Words;
  const result = await api.address.generate(HRP, mnemonic, PATH1);
  t.ok(b4a.isBuffer(result.publicKey));
  t.ok(b4a.isBuffer(result.secretKey));
  t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE);
  t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE);
  t.is(result.mnemonic, mnemonic);
  t.ok(api.address.isValid(result.address));
  t.is(result.derivationPath, PATH1);
});

test("address.generate: should generate keypair for 24 words mnemonic", async (t) => {
  const mnemonic = mnemonic24Words;
  const result = await api.address.generate(HRP, mnemonic, PATH1);
  t.ok(b4a.isBuffer(result.publicKey));
  t.ok(b4a.isBuffer(result.secretKey));
  t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE);
  t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE);
  t.is(result.mnemonic, mnemonic);
  t.ok(api.address.isValid(result.address));
  t.is(result.derivationPath, PATH1);
});

test("address.generate: should generate the same keypair for the same mnemonic and derivation path", async (t) => {
  const mnemonic = api.mnemonic.generate();
  const result1 = await api.address.generate(HRP, mnemonic, PATH1);
  const result2 = await api.address.generate(HRP, mnemonic, PATH1);
  t.ok(b4a.equals(result1.publicKey, result2.publicKey));
  t.ok(b4a.equals(result1.secretKey, result2.secretKey));
  t.is(result1.mnemonic, result2.mnemonic);
  t.is(result1.address, result2.address);
  t.is(result1.derivationPath, result2.derivationPath);
  t.is(result1.derivationPath, PATH1);
});

test("address.generate: should generate different keypairs for different mnemonic and same derivation path", async (t) => {
  const mnemonic1 = api.mnemonic.generate();
  const mnemonic2 = api.mnemonic.generate();
  const result1 = await api.address.generate(HRP, mnemonic1, PATH1);
  const result2 = await api.address.generate(HRP, mnemonic2, PATH1);
  t.not(b4a.equals(result1.publicKey, result2.publicKey));
  t.not(b4a.equals(result1.secretKey, result2.secretKey));
  t.not(result1.address, result2.address);
  t.is(result1.derivationPath, result2.derivationPath);
  t.is(result1.derivationPath, PATH1);
});

test("address.generate: should generate different keypairs for the same mnemonic and different derivation path", async (t) => {
  const mnemonic = api.mnemonic.generate();
  const result1 = await api.address.generate(HRP, mnemonic, PATH1);
  const result2 = await api.address.generate(HRP, mnemonic, PATH2);
  t.not(b4a.equals(result1.publicKey, result2.publicKey));
  t.not(b4a.equals(result1.secretKey, result2.secretKey));
  t.not(result1.address, result2.address);
  t.is(result1.derivationPath, PATH1);
  t.is(result2.derivationPath, PATH2);
});

test("address.generate: should return an error for invalid mnemonic", async (t) => {
  const invalidMnemonics = [
    "", // Empty string
    "   ", // Spaces only
    "invalid mnemonic", // Invalid words
    "abandon abandon abandon", // Too few words
    "abandon ".repeat(25).trim(), // Too many words (25)
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about extra", // 13 words
  ];

  for (const mnemonic of invalidMnemonics) {
    try {
      const result = await api.address.generate(HRP, mnemonic);
      t.fail(`Should have thrown error for invalid mnemonic: "${mnemonic}"`);
    } catch (error) {
      t.pass(`Has thrown error for invalid mnemonic "${mnemonic}": ${error.message}`); // TODO: In the future, assert the error message
    }
  }
});

test("should accept valid hrp", async (t) => {
  const validHrps = [
    "t", // Min length
    "trac",
    "a".repeat(31), // Max length
  ];

  for (const hrp of validHrps) {
    try {
      const result = await api.address.generate(hrp);
      t.is(typeof result.address, "string", `Address is string for HRP: ${hrp}`);
      t.ok(b4a.isBuffer(result.publicKey), `Public key is buffer for HRP: ${hrp}`);
      t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE, `Public key length is valid for HRP: ${hrp}`);
      t.ok(b4a.isBuffer(result.secretKey), `Secret key is buffer for HRP: ${hrp}`);
      t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE, `Secret key length is valid for HRP: ${hrp}`);
      t.is(typeof result.mnemonic, "string", `Mnemonic is string for HRP: ${hrp}`);
      t.is(typeof result.derivationPath, "string", `Derivation path is string for HRP: ${hrp}`);
    }
    catch (error) {
      t.fail(`Should not have thrown error for valid HRP ${hrp}: ${error.message}`);
    }
  }
});

test("address.generate: should return an error for invalid hrp", async (t) => {
  const invalidHrps = [
    {}, // Not a string
    "", // Empty string
    "   ", // Spaces only
    "a".repeat(32), // Too long
    "Trac", // Uppercase letters
    "tr@c", // Special characters
    "trac-hrp", // Contains hyphen
    "trac_hrp", // Contains underscore
    "тест", // Non-ASCII characters
    "hrp1", // Contains special separator '1'
    "hrp2", // Contains number
  ];

  for (const hrp of invalidHrps) {
    try {
      const result = await api.address.generate(hrp);
      t.fail();
    } catch (error) {
      t.pass(`Has thrown error for invalid hrp: ${error.message}`); // TODO: In the future, assert the error message
    }
  }
});

test("address.generate: should accept valid derivation paths", async (t) => {
  const mnemonic = api.mnemonic.generate();
  const paths = [
    undefined, // No path provided, should use default
    null, // No path provided, should use default
    "m/0'",
    "m/0'/1'",
    "m/0'   /1'", // spaces are trimmed
    "m/44'/60'" + "/0'".repeat(256), // Accepts big paths
    "m/2147483647'/2147483646'/2147483645'", // Max hardened index values
  ];

  // Paths are accepted as valid
  for (const path of paths) {
    const result = await api.address.generate(HRP, mnemonic, path);
    console.log("Testing valid path:", path);
    t.is(typeof result.address, "string", "Address is string");
    t.ok(b4a.isBuffer(result.publicKey), "Public key is buffer");
    t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE, "Public key length is valid");
    t.ok(b4a.isBuffer(result.secretKey), "Secret key is buffer");
    t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE, "Secret key length is valid");
    t.is(typeof result.mnemonic, "string", "Mnemonic is string");
    t.is(typeof result.derivationPath, "string", "Derivation path is string");
    if (typeof path !== "string") {
      t.is(result.derivationPath, "m/0'/0'/0'", "Derivation path is default");
    } else {
      t.is(result.derivationPath, path.replace(/\s+/g, ''), "Spaces were trimmed"); // Path with spaces trimmed
    }
    // Verify address checksum
    t.ok(api.address.isValid(result.address), "Address is valid");
    t.ok(bech32m.decode(result.address).prefix === HRP, "Address could be decoded and has correct HRP");
  }
});

test("address.generate: equivalent paths should produce the same result", async (t) => {
  const mnemonic = api.mnemonic.generate();
  const result1 = await api.address.generate(HRP, mnemonic, "m/0'/1'");
  const result2 = await api.address.generate(HRP, mnemonic, "m/0'   /1'");
  t.ok(b4a.equals(result1.publicKey, result2.publicKey));
  t.ok(b4a.equals(result1.secretKey, result2.secretKey));
  t.is(result1.mnemonic, result2.mnemonic);
  t.is(result1.address, result2.address);
  t.is(result1.derivationPath, result2.derivationPath);
});

test("address.generate: should throw an error for invalid derivation paths", async (t) => {
  const paths = [
    1234, // Not a string
    { valid: false }, // Not a string
    "invalid_path",
    "m/", // No segments
    "m/a'", // invalid segment
    "m/0/1", // Non-hardened segments
    "m/0'/1/2'", // Non-hardened segments
    "m/2147483648'/2147483647'/2147483646'", // index bigger than max hardened value
    "n/0'/1'", // Doesn't start with m/
    "", // Empty string
    "   ", // Spaces only
  ];
  const mnemonic = api.mnemonic.generate();

  for (const path of paths) {
    try {
      const result = await api.address.generate(HRP, mnemonic, path);
      t.fail(`Should have thrown error for invalid path: ${path}`);
    } catch (error) {
      t.pass(`Has thrown error for invalid path ${path}: ${error.message}`); // TODO: In the future, assert the error message
    }
  }
});

test("address.fromSecretKey: should derive the correct address and public key from a given secret key", async (t) => {
  const original = await api.address.generate(HRP);
  const derived = api.address.fromSecretKey(HRP, original.secretKey);
  t.is(derived.address, original.address);
  t.ok(b4a.equals(derived.publicKey, original.publicKey));
  t.ok(b4a.equals(derived.secretKey, original.secretKey));
});

test("address.fromSecretKey: should throw on invalid secret key", async (t) => {
  const invalidKeys = [
    Buffer.alloc(10), // Too short
    Buffer.alloc(100), // Too long
    "not a buffer", // Not a buffer
    12345, // Not a buffer
    null, // Not a buffer
    undefined, // Not a buffer
  ];

  for (const key of invalidKeys) {
    try {
      const result = await api.address.fromSecretKey(key, HRP);
      t.fail("Should have thrown error for invalid secret key");
    } catch (error) {
      t.pass(`Has thrown error for invalid secret key: ${error.message}`); // TODO: In the future, assert the error message
    }
  }
});
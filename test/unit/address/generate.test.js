const test = require("brittle");
const api = require("../../../index.js");
const { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } = require("../../../constants.js");
const b4a = require("b4a");

const HRP = "trac";
const PATH1 = "m/0'/1'/2'";
const PATH2 = "m/0'/1'/10000000'";

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
  try {
    const mnemonic = "invalid mnemonic";
    const result = await api.address.generate(HRP, mnemonic);
    t.fail();
  } catch (error) {
    t.pass(`Has thrown error for invalid mnemonic: ${error.message}`); // TODO: In the future, assert the error message
  }
});

test("address.generate: should return an error for missing hrp", async (t) => {
  try {
    const result = await api.address.generate(null);
    t.fail();
  } catch (error) {
    t.pass(`Has thrown error for missing hrp: ${error.message}`); // TODO: In the future, assert the error message
  }
});

test("address.generate: should accept valid derivation paths", async (t) => {
  const mnemonic = api.mnemonic.generate();
  const paths = [
    undefined, // No path provided, should use default
    "m/0'",
    "m/0'/1'",
    "m/0'   /1'", // spaces are trimmed
    "m/44'/60'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'/0'", // Accepts big paths
    "m/2147483647'/2147483646'/2147483645'", // Max hardened index values
  ];

  // Paths are accepted as valid
  for (const path of paths) {
    const result = await api.address.generate(HRP, mnemonic, path);
    t.is(typeof result.address, "string", `Valid path: ${path}`);
    t.ok(b4a.isBuffer(result.publicKey), `Valid path: ${path}`);
    t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE, `Valid path: ${path}`);
    t.ok(b4a.isBuffer(result.secretKey), `Valid path: ${path}`);
    t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE, `Valid path: ${path}`);
    t.is(typeof result.mnemonic, "string", `Valid path: ${path}`);
    t.is(typeof result.derivationPath, "string", `Valid path: ${path}`);
    if (path === undefined) {
      t.is(result.derivationPath, "m/0'/0'/0'", `Valid path: ${path}`); // Default path
    } else {
      t.is(result.derivationPath, path.replace(/\s+/g, ''), `Valid path: ${path}`); // Path with spaces trimmed
    }
  }

  // Equivalent paths produce the same result
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
    null, // Missing path
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
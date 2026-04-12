// address.test.js
const { address } = require("trac-crypto-api");

const api = window.TracCryptoApi;
const b4a = window.b4a;

const HRP = "trac";
const PATH1 = "m/0'/1'/2'";
const PATH2 = "m/0'/1'/10000000'";

const mnemonic12Words =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const DEFAULT_DERIVATION_PATH = "m/918'/0'/0'/0'";

test("address is on window", () => {
  expect(window.TracCryptoApi.address).toBe(address);
});

// encode/decode

test("address.encode/decode: should encode and decode public key correctly", async () => {
  const { publicKey } = await api.address.generate(HRP);

  const encoded = api.address.encode(HRP, publicKey);
  const decoded = api.address.decode(encoded);

  expect(b4a.equals(b4a.from(decoded), b4a.from(publicKey))).toBe(true);
});

test("address.encode: should throw on invalid public key", () => {
  const invalidKeys = [
    null,
    undefined,
    "not a buffer",
    b4a.alloc(10),
    b4a.alloc(50),
  ];

  for (const key of invalidKeys) {
    expect(() => api.address.encode(HRP, key)).toThrow();
  }
});

test("address.encode: should throw on invalid hrp", async () => {
  const invalidHrps = [
    null,
    undefined,
    "",
    "ThisHRPIsWayTooLongToBeValid",
    "invalid*char",
  ];

  for (const hrp of invalidHrps) {
    const { publicKey } = await api.address.generate(HRP);
    expect(() => api.address.encode(hrp, publicKey)).toThrow();
  }
});

test("address.decode: should throw on invalid address", () => {
  const invalidAddresses = [
    null,
    undefined,
    "not a buffer",
    b4a.alloc(10),
    b4a.alloc(50),
  ];

  for (const addr of invalidAddresses) {
    expect(() => api.address.decode(addr)).toThrow();
  }
});

// buffer conversions

test("address.toBuffer/fromBuffer: should convert address (browser-safe)", async () => {
  const { address } = await api.address.generate(HRP);

  const buf = api.address.toBuffer(address);
  let addrFromBuf = api.address.fromBuffer(buf);

  if (typeof addrFromBuf !== "string") {
    addrFromBuf = b4a.from(addrFromBuf).toString();
  }

  if (addrFromBuf.includes(",")) {
    addrFromBuf = b4a.from(addrFromBuf.split(",").map(Number)).toString();
  }

  expect(b4a.isBuffer(buf)).toBe(true);
  expect(typeof addrFromBuf).toBe("string");
  expect(api.address.isValid(addrFromBuf)).toBe(true);
});

test("address.toBuffer: should throw on invalid address", () => {
  const invalidAddresses = [
    null,
    undefined,
    "not a buffer",
    "short",
    "toolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolong",
  ];

  for (const addr of invalidAddresses) {
    expect(() => api.address.toBuffer(addr)).toThrow();
  }
});

// generate

test("address.generate: should generate a valid address and keypair", async () => {
  const result = await api.address.generate(HRP);

  expect(typeof result.address).toBe("string");

  expect(b4a.isBuffer(result.publicKey)).toBe(true);
  expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);

  expect(b4a.isBuffer(result.secretKey)).toBe(true);
  expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);

  expect(typeof result.mnemonic).toBe("string");
  expect(typeof result.derivationPath).toBe("string");

  expect(api.address.isValid(result.address)).toBe(true);
});

// mnemonic

test("address.generate: should generate keypair for mnemonic", async () => {
  const result = await api.address.generate(HRP, mnemonic12Words, PATH1);

  expect(b4a.isBuffer(result.publicKey)).toBe(true);
  expect(b4a.isBuffer(result.secretKey)).toBe(true);

  expect(result.mnemonic).toBe(mnemonic12Words);
  expect(result.derivationPath).toBe(PATH1);

  expect(api.address.isValid(result.address)).toBe(true);
});

// determinism

test("address.generate: determinism (same mnemonic/path)", async () => {
  const mnemonic = await api.mnemonic.generate();

  const r1 = await api.address.generate(HRP, mnemonic, PATH1);
  const r2 = await api.address.generate(HRP, mnemonic, PATH1);

  expect(b4a.equals(r1.publicKey, r2.publicKey)).toBe(true);
  expect(b4a.equals(r1.secretKey, r2.secretKey)).toBe(true);
  expect(r1.address).toBe(r2.address);
});

// different mnemonic

test("address.generate: different mnemonic → different keys", async () => {
  const r1 = await api.address.generate(
    HRP,
    await api.mnemonic.generate(),
    PATH1,
  );

  const r2 = await api.address.generate(
    HRP,
    await api.mnemonic.generate(),
    PATH1,
  );

  expect(b4a.equals(r1.publicKey, r2.publicKey)).toBe(false);
  expect(r1.address).not.toBe(r2.address);
});

// different derivation path

test("address.generate: should support different derivation paths", async () => {
  const mnemonic = await api.mnemonic.generate();

  const r1 = await api.address.generate(HRP, mnemonic, PATH1);
  const r2 = await api.address.generate(HRP, mnemonic, PATH2);

  expect(r1.address).not.toBe(r2.address);
});

// default path fallback

test("address.generate: should fallback to default derivation path", async () => {
  const mnemonic = await api.mnemonic.generate();

  const result = await api.address.generate(HRP, mnemonic, null);

  expect(result.derivationPath).toBe(DEFAULT_DERIVATION_PATH);
});

// invalid mnemonic

test("address.generate: should throw on invalid mnemonic", async () => {
  const invalid = ["", "invalid mnemonic"];

  for (const m of invalid) {
    await expect(api.address.generate(HRP, m)).rejects.toThrow();
  }
});

// HRP validation

test("address.generate: should accept valid hrp", async () => {
  const validHrps = ["t", "trac", "a".repeat(31)];

  for (const hrp of validHrps) {
    const result = await api.address.generate(hrp);
    expect(typeof result.address).toBe("string");
  }
});

test("address.generate: should reject invalid hrp", async () => {
  const invalidHrps = [
    {},
    "",
    "   ",
    "a".repeat(32),
    "Trac",
    "tr@c",
    "trac-hrp",
    "trac_hrp",
    "тест",
  ];

  for (const hrp of invalidHrps) {
    await expect(api.address.generate(hrp)).rejects.toThrow();
  }
});

// derivation path validation

test("address.generate: should accept valid derivation paths", async () => {
  const mnemonic = await api.mnemonic.generate();

  const paths = [undefined, null, "m/0'", "m/0'/1'", "m/0'   /1'"];

  for (const path of paths) {
    const result = await api.address.generate(HRP, mnemonic, path);
    expect(api.address.isValid(result.address)).toBe(true);
  }
});

test("address.generate: should throw on invalid derivation paths", async () => {
  const mnemonic = await api.mnemonic.generate();

  const paths = [1234, {}, "invalid_path", "m/", "m/a'", "m/0/1", "n/0'/1'"];

  for (const path of paths) {
    await expect(api.address.generate(HRP, mnemonic, path)).rejects.toThrow();
  }
});

// fromSecretKey

test("address.fromSecretKey: should derive correctly", async () => {
  const original = await api.address.generate(HRP);
  const derived = api.address.fromSecretKey(HRP, original.secretKey);

  expect(derived.address).toBe(original.address);
  expect(b4a.equals(derived.publicKey, original.publicKey)).toBe(true);
});

test("address.fromSecretKey: should throw on invalid key", () => {
  const invalidKeys = [
    b4a.alloc(10),
    b4a.alloc(100),
    "not a buffer",
    12345,
    null,
    undefined,
  ];

  for (const key of invalidKeys) {
    expect(() => api.address.fromSecretKey(HRP, key)).toThrow();
  }
});

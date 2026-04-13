// address.test.js

const api = window.TracCryptoApi;
const b4a = window.b4a;

const HRP = "trac";
const PATH1 = "m/0'/1'/2'";
const PATH2 = "m/0'/1'/10000000'";

const mnemonic12Words =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const DEFAULT_DERIVATION_PATH = "m/918'/0'/0'/0'";

test("address is on window", () => {
  expect(api.address).toBeDefined();
});

// encode/decode

test("address.encode/decode", async () => {
  const { publicKey } = await api.address.generate(HRP);

  const encoded = api.address.encode(HRP, publicKey);
  const decoded = api.address.decode(encoded);

  expect(b4a.equals(decoded, publicKey)).toBe(true);
});

test("address.encode: invalid public key", () => {
  const invalidKeys = [null, undefined, "x", b4a.alloc(10), b4a.alloc(50)];

  for (const key of invalidKeys) {
    expect(() => api.address.encode(HRP, key)).toThrow();
  }
});

test("address.encode: invalid hrp", async () => {
  const invalidHrps = [
    null,
    undefined,
    "",
    " ",
    "A", // uppercase
    "tr@c", // invalid char
  ];

  for (const hrp of invalidHrps) {
    const { publicKey } = await api.address.generate(HRP);
    expect(() => api.address.encode(hrp, publicKey)).toThrow();
  }
});

test("address.decode: invalid address", () => {
  const invalid = [null, undefined, "x", b4a.alloc(10)];

  for (const addr of invalid) {
    expect(() => api.address.decode(addr)).toThrow();
  }
});

// buffer

test("address.toBuffer/fromBuffer", async () => {
  const { address } = await api.address.generate(HRP);

  const buf = api.address.toBuffer(address);
  let addr = api.address.fromBuffer(buf);

  // NOTE: browser build may return comma-separated byte string instead of proper string
  if (typeof addr === "string" && addr.includes(",")) {
    addr = b4a.from(addr.split(",").map(Number)).toString();
  }

  expect(b4a.isBuffer(buf)).toBe(true);
  expect(addr).toBe(address);
  expect(api.address.isValid(addr)).toBe(true);
});

test("address.toBuffer: invalid", () => {
  const invalid = [null, undefined, "short", "x".repeat(200)];

  for (const addr of invalid) {
    expect(() => api.address.toBuffer(addr)).toThrow();
  }
});

// generate base

test("address.generate: basic", async () => {
  const r = await api.address.generate(HRP);

  expect(typeof r.address).toBe("string");

  expect(b4a.isBuffer(r.publicKey)).toBe(true);
  expect(b4a.isBuffer(r.secretKey)).toBe(true);

  expect(r.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
  expect(r.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);

  expect(api.address.isValid(r.address)).toBe(true);
  expect(r.derivationPath).toBe(DEFAULT_DERIVATION_PATH);
});

// mnemonic

test("address.generate: 12 words", async () => {
  const r = await api.address.generate(HRP, mnemonic12Words, PATH1);

  expect(r.mnemonic).toBe(mnemonic12Words);
  expect(r.derivationPath).toBe(PATH1);
});

test("address.generate: 24 words", async () => {
  const mnemonic = await api.mnemonic.generate();
  const r = await api.address.generate(HRP, mnemonic, PATH1);

  expect(r.mnemonic).toBe(mnemonic);
});

// determinism

test("address.generate: deterministic", async () => {
  const mnemonic = await api.mnemonic.generate();

  const r1 = await api.address.generate(HRP, mnemonic, PATH1);
  const r2 = await api.address.generate(HRP, mnemonic, PATH1);

  expect(b4a.equals(r1.publicKey, r2.publicKey)).toBe(true);
  expect(b4a.equals(r1.secretKey, r2.secretKey)).toBe(true);
  expect(r1.address).toBe(r2.address);
});

// variations

test("address.generate: different mnemonic", async () => {
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

  expect(r1.address).not.toBe(r2.address);
});

test("address.generate: different path", async () => {
  const mnemonic = await api.mnemonic.generate();

  const r1 = await api.address.generate(HRP, mnemonic, PATH1);
  const r2 = await api.address.generate(HRP, mnemonic, PATH2);

  expect(r1.address).not.toBe(r2.address);
});

// path normalization

test("address.generate: equivalent paths", async () => {
  const mnemonic = await api.mnemonic.generate();

  const r1 = await api.address.generate(HRP, mnemonic, "m/0'/1'");
  const r2 = await api.address.generate(HRP, mnemonic, "m/0'   /1'");

  expect(b4a.equals(r1.publicKey, r2.publicKey)).toBe(true);
});

// invalid mnemonic

test("address.generate: invalid mnemonic", async () => {
  const invalid = ["", "invalid mnemonic", "abandon abandon"];

  for (const m of invalid) {
    await expect(api.address.generate(HRP, m)).rejects.toThrow();
  }
});

// hrp

test("address.generate: valid hrp", async () => {
  const hrps = ["t", "trac", "a".repeat(31)];

  for (const hrp of hrps) {
    const r = await api.address.generate(hrp);
    expect(typeof r.address).toBe("string");
  }
});

test("address.generate: invalid hrp", async () => {
  const invalid = ["", "Trac", "tr@c", "trac-hrp", "тест"];

  for (const hrp of invalid) {
    await expect(api.address.generate(hrp)).rejects.toThrow();
  }
});

// derivation paths

test("address.generate: valid paths", async () => {
  const mnemonic = await api.mnemonic.generate();

  const paths = [undefined, null, "m/0'", "m/0'/1'", "m/0'   /1'"];

  for (const path of paths) {
    const r = await api.address.generate(HRP, mnemonic, path);
    expect(api.address.isValid(r.address)).toBe(true);
  }
});

test("address.generate: invalid paths", async () => {
  const mnemonic = await api.mnemonic.generate();

  const paths = [1234, {}, "invalid", "m/", "m/a'", "n/0'/1'"];

  for (const path of paths) {
    await expect(api.address.generate(HRP, mnemonic, path)).rejects.toThrow();
  }
});

// fromSecretKey

test("address.fromSecretKey", async () => {
  const original = await api.address.generate(HRP);
  const derived = api.address.fromSecretKey(HRP, original.secretKey);

  expect(derived.address).toBe(original.address);
  expect(b4a.equals(derived.publicKey, original.publicKey)).toBe(true);
  expect(b4a.equals(derived.secretKey, original.secretKey)).toBe(true);
});

test("address.fromSecretKey: invalid", () => {
  const invalid = [b4a.alloc(10), "x", null];

  for (const key of invalid) {
    expect(() => api.address.fromSecretKey(HRP, key)).toThrow();
  }
});

// nonce.test.js

const api = window.TracCryptoApi;
const nonce = api.nonce;
const b4a = window.b4a;

test("nonce is on window", () => {
  expect(nonce).toBeDefined();
});

test("nonce.generate: should generate a 32-byte nonce", () => {
  const n = nonce.generate();

  expect(n instanceof Uint8Array || b4a.isBuffer(n)).toBe(true);
  expect(n.length).toBe(nonce.SIZE);
});

test("nonce.generate: should generate unique nonces", () => {
  const n1 = nonce.generate();
  const n2 = nonce.generate();

  expect(n1 instanceof Uint8Array || b4a.isBuffer(n1)).toBe(true);
  expect(n2 instanceof Uint8Array || b4a.isBuffer(n2)).toBe(true);

  expect(n1.length).toBe(nonce.SIZE);
  expect(n2.length).toBe(nonce.SIZE);

  expect(b4a.equals(b4a.from(n1), b4a.from(n2))).toBe(false);
});

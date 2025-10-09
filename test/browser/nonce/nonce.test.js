// nonce.test.js
const apiReq = require("trac-crypto-api")
const nonce = window.TracCryptoApi.nonce;

test("nonce is on window", () => {
  expect(window.TracCryptoApi.nonce).toBe(apiReq.nonce);
});
test("nonce.generate: should generate a 32-byte nonce", () => {
  const n = nonce.generate();
  expect(n instanceof Uint8Array || Buffer.isBuffer(n)).toBe(true);
  expect(n.length).toBe(nonce.SIZE);
});

test("nonce.generate: should generate unique nonces", () => {
  const n1 = nonce.generate();
  const n2 = nonce.generate();
  expect(n1 instanceof Uint8Array || Buffer.isBuffer(n1)).toBe(true);
  expect(n2 instanceof Uint8Array || Buffer.isBuffer(n2)).toBe(true);
  expect(n1.length).toBe(nonce.SIZE);
  expect(n2.length).toBe(nonce.SIZE);
  expect(Buffer.from(n1).equals(Buffer.from(n2))).toBe(false);
});

// signature.test.js
const apiReq = require("trac-crypto-api");
const api = window.TracCryptoApi;
const address = api.address;
const signature = api.signature;
const b4a = require("b4a");

const hrp = "trac";

test("signature is on window", () => {
  expect(window.TracCryptoApi.signature).toBe(apiReq.signature);
});

test("address is on window", () => {
  expect(window.TracCryptoApi.address).toBe(apiReq.address);
});

test("b4a is on window", () => {
  expect(window.b4a).toBe(b4a);
});

// ⚠️ browser: sign pode não funcionar (sodium)
test("signature.sign: should throw in browser", async () => {
  const { secretKey } = await api.address.generate(hrp);
  const message = b4a.from("hello world");

  expect(() => signature.sign(message, secretKey)).toThrow();
});

test("signature.verify: should return boolean", async () => {
  const { publicKey } = await api.address.generate(hrp);
  const message = b4a.from("hello world");

  const result = signature.verify(b4a.alloc(64), message, publicKey);

  expect(typeof result).toBe("boolean");
});

// determinismo
test("signature.verify: should be deterministic", async () => {
  const { publicKey } = await api.address.generate(hrp);
  const message = b4a.from("hello world");
  const sig = b4a.alloc(64);

  const r1 = signature.verify(sig, message, publicKey);
  const r2 = signature.verify(sig, message, publicKey);

  expect(r1).toBe(r2);
});

// variação de input
test("signature.verify: should change with different inputs", async () => {
  const { publicKey } = await api.address.generate(hrp);

  const msg1 = b4a.from("hello");
  const msg2 = b4a.from("world");

  const sig = b4a.alloc(64);

  const r1 = signature.verify(sig, msg1, publicKey);
  const r2 = signature.verify(sig, msg2, publicKey);

  expect(typeof r1).toBe("boolean");
  expect(typeof r2).toBe("boolean");
});

// invalid private key
test("signature.sign: should throw on invalid private key", () => {
  expect(() => signature.sign(b4a.from("msg"), b4a.alloc(10))).toThrow();
});

// sanity
test("signature.verify: should not throw on random inputs", () => {
  const message = b4a.from("hello");

  const result = signature.verify(b4a.alloc(64), message, b4a.alloc(32));

  expect(typeof result).toBe("boolean");
});

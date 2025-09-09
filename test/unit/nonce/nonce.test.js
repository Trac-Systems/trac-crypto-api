const test = require("brittle");
const nonce = require("../../../modules/nonce.js");

test("nonce.generate: should generate a 32-byte nonce", (t) => {
  const n = nonce.generate();
  t.ok(Buffer.isBuffer(n));
  t.is(n.length, nonce.SIZE);
});

test("nonce.generate: should generate unique nonces", (t) => {
  const n1 = nonce.generate();
  const n2 = nonce.generate();
  t.not(n1.equals(n2), true);
});

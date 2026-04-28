const test = require("brittle");
const signature = require("../../../modules/signature.js");
const address = require("../../../modules/address.js");

const hrp = "trac";

test("signature.sign/verify: should sign and verify a message", async (t) => {
  const { publicKey, secretKey } = await address.generate(hrp);
  const message = Buffer.from("hello world");
  const sig = signature.sign(message, secretKey);
  t.ok(Buffer.isBuffer(sig));
  t.ok(sig.length > 0);
  const valid = signature.verify(sig, message, publicKey);
  t.is(valid, true);
});

test("signature.verify: should fail verification for wrong message", async (t) => {
  const { publicKey, secretKey } = await address.generate(hrp);
  const message = Buffer.from("hello world");
  const sig = signature.sign(message, secretKey);
  const valid = signature.verify(sig, Buffer.from("other message"), publicKey);
  t.is(valid, false);
});

test("signature.sign: should throw on invalid private key", (t) => {
  try {
    signature.sign(Buffer.from("msg"), Buffer.alloc(10));
    t.fail();
  } catch {
    t.pass();
  }
});

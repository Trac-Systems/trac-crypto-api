const test = require("brittle");
const api = require("../../../index.js");
const { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } = require("../../../constants.js");
const b4a = require("b4a");

const HRP = "trac";

test("address.encode/decode: should encode and decode public key correctly", async (t) => {
  const { publicKey } = await api.address.generate(HRP);
  const encoded = api.address.encode(HRP, publicKey);
  const decoded = api.address.decode(encoded);
  t.ok(decoded.equals(publicKey));
});

test("address.encode: should throw on invalid public key", (t) => {
  try {
    api.address.encode(HRP, Buffer.alloc(10));
    t.fail();
  } catch {
    t.pass();
  }
});

test("address.decode: should throw on invalid address", (t) => {
  try {
    api.address.decode("invalidaddress");
    t.fail();
  } catch {
    t.pass();
  }
});
const test = require("brittle");
const api = require("../../../index.js");
const b4a = require("b4a");

test("memzero: should zero out a buffer", (t) => {
  const buf = b4a.from("hello world");
  api.utils.memzero(buf);
  t.ok(buf.every((byte) => byte === 0));
});

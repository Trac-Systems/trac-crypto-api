const t = require("brittle");

t.test("node env should not have browser globals after loading index", (t) => {
  // Enforce clean state before testing
  delete globalThis.document;
  delete globalThis.location;

  require("../../../index.js");

  t.is(typeof globalThis.document, "undefined");
  t.is(typeof globalThis.location, "undefined");
});

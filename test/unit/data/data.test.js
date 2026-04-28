const test = require("brittle");
const api = require("../../../index.js");
const b4a = require("b4a");

test("encrypt and decrypt: should encrypt and decrypt a message", (t) => {
  const password = b4a.from("someP@ssw0rd");
  const message = b4a.from("hello world!");
  const encrypted = api.data.encrypt(message, password);
  t.ok(b4a.isBuffer(encrypted.nonce));
  t.ok(b4a.isBuffer(encrypted.salt));
  t.ok(b4a.isBuffer(encrypted.ciphertext));
  const decrypted = api.data.decrypt(encrypted, password);
  t.ok(b4a.equals(decrypted, message));
});

test("encrypt: should throw if password is not a buffer", (t) => {
  const message = b4a.from("hello world");
  try {
    api.data.encrypt(message, "notabuffer");
    t.fail("Should have thrown an error");
  } catch (err) {
    t.ok(err);
  }
});

test("encrypt: should throw if message is not a buffer", (t) => {
  const password = b4a.from("someP@ssw0rd");
  try {
    api.data.encrypt("notabuffer", password);
  } catch (err) {
    t.ok(err);
  }
});

test("decrypt: should throw if data format is invalid", (t) => {
  const password = b4a.from("someP@ssw0rd");
  try {
    api.data.decrypt({}, password);
  } catch (err) {
    t.ok(err);
  }
  try {
    api.data.decrypt(
      { nonce: "notabuffer", salt: "notabuffer", ciphertext: "notabuffer" },
      password
    );
  } catch (err) {
    t.ok(err);
  }
});

test("decrypt: should throw if decryption fails", (t) => {
  const password = b4a.from("someP@ssw0rd");
  const wrongPassword = b4a.from("someOtherP@ssw0rd");
  const message = b4a.from("hello world");
  const encrypted = api.data.encrypt(message, password);
  try {
    api.data.decrypt(encrypted, wrongPassword);
    t.fail("Decryption should have failed");
  } catch (err) {
    t.ok(err);
  }
});

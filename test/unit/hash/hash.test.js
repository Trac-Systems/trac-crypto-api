import test from "brittle";
import hash from "../../../modules/hash.js";
import b4a from "b4a";

const MESSAGE = "hello world";
const MESSAGE_BUFFER = b4a.from(MESSAGE);
const MESSAGE_ARRAY = new Uint8Array(MESSAGE_BUFFER);
const BLAKE3_DIGEST =
  "d74981efa70a0c880b8d8c1985d075dbcbf679b99a5f9914e5aaf96b831a9e24";
const SHA256_DIGEST =
  "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

test("hash.blake3: should compute Blake3 hash of a Buffer", async (t) => {
  const digest = await hash.blake3(MESSAGE_BUFFER);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 32);
  t.ok(b4a.equals(digest, b4a.from(BLAKE3_DIGEST, "hex")));
});

test("hash.blake3: should compute Blake3 hash of a Uint8Array", async (t) => {
  const digest = await hash.blake3(MESSAGE_ARRAY);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 32);
  t.ok(b4a.equals(digest, b4a.from(BLAKE3_DIGEST, "hex")));
});

test("hash.blake3: should throw for invalid input", async (t) => {
  try {
    const digest = await hash.blake3(MESSAGE);
    t.fail("Expected error for invalid input");
  } catch (err) {
    t.is(err.message, "Invalid input: must be a Buffer or Uint8Array");
  }
});

test("hash.blake3Safe: should not throw for invalid input", async (t) => {
  const digest = await hash.blake3Safe(MESSAGE);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 0);
});

test("hash.sha256: should compute SHA-256 hash of a Buffer", (t) => {
  const msg = b4a.from(MESSAGE);
  const digest = hash.sha256(msg);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 32);
  t.ok(b4a.equals(digest, b4a.from(SHA256_DIGEST, "hex")));
});

test("hash.sha256: should compute SHA-256 hash of a Uint8Array", (t) => {
  const msg = new Uint8Array(b4a.from(MESSAGE));
  const digest = hash.sha256(msg);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 32);
  t.ok(b4a.equals(digest, b4a.from(SHA256_DIGEST, "hex")));
});

test("hash.sha256: should throw for invalid input", async (t) => {
  try {
    const digest = await hash.sha256(MESSAGE);
    t.fail("Expected error for invalid input.");
  } catch (err) {
    t.is(err.message, "Invalid input: must be a Buffer or Uint8Array");
  }
});

test("hash.sha256Safe: should not throw for invalid input", async (t) => {
  const digest = await hash.sha256Safe(MESSAGE);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 0);
});

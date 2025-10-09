// hash.test.js
const apiReq = require("trac-crypto-api");
const hash = window.TracCryptoApi.hash;
const b4a = window.b4a;

const MESSAGE = "hello world";
const MESSAGE_BUFFER = b4a.from(MESSAGE);
const MESSAGE_ARRAY = new Uint8Array(MESSAGE_BUFFER);
const BLAKE3_DIGEST = "d74981efa70a0c880b8d8c1985d075dbcbf679b99a5f9914e5aaf96b831a9e24";
const SHA256_DIGEST = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

test("hash module is on window", () => {
    expect(window.TracCryptoApi.hash).toBe(apiReq.hash);
});

test("hash.blake3: should compute Blake3 hash of a Buffer", async () => {
    const digest = await hash.blake3(MESSAGE_BUFFER);
    expect(b4a.isBuffer(digest)).toBe(true);
    expect(digest.length).toBe(32);
    expect(b4a.equals(digest, b4a.from(BLAKE3_DIGEST, "hex"))).toBe(true);
});

test("hash.blake3: should compute Blake3 hash of a Uint8Array", async () => {
    const digest = await hash.blake3(MESSAGE_ARRAY);
    expect(b4a.isBuffer(digest)).toBe(true);
    expect(digest.length).toBe(32);
    expect(b4a.equals(digest, b4a.from(BLAKE3_DIGEST, "hex"))).toBe(true);
});

test("hash.blake3: should throw for invalid input", async () => {
    try {
        const digest = await hash.blake3(MESSAGE);
        fail("Expected error was not thrown");
    } catch (error) {
        expect(error.message).toBe("Invalid input: must be a Buffer or Uint8Array");
    }
});

test("hash.blake3Safe: should not throw for invalid input", async () => {
    try {
        const digest = await hash.blake3Safe(MESSAGE);
        expect(b4a.isBuffer(digest)).toBe(true);
        expect(digest.length).toBe(0);
    } catch (error) {
        fail("Unexpected error was thrown: " + error.message);
    }
});

test("hash.sha256: should compute SHA-256 hash of a Buffer", () => {
    const msg = b4a.from(MESSAGE);
    const digest = hash.sha256(msg);
    expect(b4a.isBuffer(digest)).toBe(true);
    expect(digest.length).toBe(32);
    expect(b4a.equals(digest, b4a.from(SHA256_DIGEST, "hex"))).toBe(true);
});

test("hash.sha256: should compute SHA-256 hash of a Uint8Array", () => {
    const msg = new Uint8Array(b4a.from(MESSAGE));
    const digest = hash.sha256(msg);
    expect(b4a.isBuffer(digest)).toBe(true);
    expect(digest.length).toBe(32);
    expect(b4a.equals(digest, b4a.from(SHA256_DIGEST, "hex"))).toBe(true);
});

test("hash.sha256: should throw for invalid input", async () => {
    try {
        digest = await hash.sha256(MESSAGE);
        fail("Expected error was not thrown");
    } catch (error) {
        expect(error.message).toBe("Invalid input: must be a Buffer or Uint8Array");
    }
});

test("hash.sha256Safe: should not throw for invalid input", async () => {
    try {
        const digest = await hash.sha256Safe(MESSAGE);
        expect(b4a.isBuffer(digest)).toBe(true);
        expect(digest.length).toBe(0);
    }
    catch (error) {
        fail("Unexpected error was thrown: " + error.message);
    }
});

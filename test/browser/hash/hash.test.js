// hash.test.js
// NOTE: browser build does not reliably support Node Buffer, use Uint8Array
const api = window.TracCryptoApi;
const hash = api.hash;
const b4a = window.b4a;

const MESSAGE = "hello world";

const MESSAGE_UINT8 = new Uint8Array(b4a.from(MESSAGE));

const BLAKE3_DIGEST =
  "d74981efa70a0c880b8d8c1985d075dbcbf679b99a5f9914e5aaf96b831a9e24";

const SHA256_DIGEST =
  "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

test("hash module is on window", () => {
  expect(api.hash).toBeDefined();
});

// ===== BLAKE3 =====

test("hash.blake3: Uint8Array input", async () => {
  const digest = await hash.blake3(MESSAGE_UINT8);

  const normalized = b4a.from(digest);

  expect(normalized.length).toBe(32);
  expect(b4a.equals(normalized, b4a.from(BLAKE3_DIGEST, "hex"))).toBe(true);
});

test("hash.blake3: invalid input", async () => {
  await expect(hash.blake3(MESSAGE)).rejects.toThrow(
    "Invalid input: must be a Buffer or Uint8Array",
  );
});

test("hash.blake3Safe: invalid input", async () => {
  const digest = await hash.blake3Safe(MESSAGE);

  const normalized = b4a.from(digest);

  expect(normalized.length).toBe(0);
});

// ===== SHA256 =====

test("hash.sha256: Uint8Array input", () => {
  const digest = hash.sha256(MESSAGE_UINT8);

  const normalized = b4a.from(digest);

  expect(normalized.length).toBe(32);
  expect(b4a.equals(normalized, b4a.from(SHA256_DIGEST, "hex"))).toBe(true);
});

test("hash.sha256: invalid input", () => {
  expect(() => hash.sha256(MESSAGE)).toThrow(
    "Invalid input: must be a Buffer or Uint8Array",
  );
});

test("hash.sha256Safe: invalid input", async () => {
  const digest = await hash.sha256Safe(MESSAGE);

  const normalized = b4a.from(digest);

  expect(normalized.length).toBe(0);
});

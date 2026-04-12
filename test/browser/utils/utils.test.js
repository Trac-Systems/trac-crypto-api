// utils.test.js
const apiReq = require("trac-crypto-api");
const api = window.TracCryptoApi;
const b4a = window.b4a;

test("utils is on window", () => {
  expect(window.TracCryptoApi.utils).toBe(apiReq.utils);
});

test("b4a is on window", () => {
  expect(window.b4a).toBeDefined();
});

test("memzero: should zero out a buffer", () => {
  const buf = new Uint8Array(b4a.from("hello world"));

  api.utils.memzero(buf);

  expect([...buf].every((byte) => byte === 0)).toBe(true);
});

test("should not change a non-buffer object in the browser", () => {
  const { memzero } = window.TracCryptoApi.utils;
  const nonBuffer = { a: 1, b: "test" };
  const originalValue = JSON.stringify(nonBuffer);

  memzero(nonBuffer);

  expect(JSON.stringify(nonBuffer)).toBe(originalValue);
});

test("toUInt32: should convert a number to a 4-byte big-endian buffer", () => {
  const num = 16909060;
  const buf = api.utils.toUInt32(num, 0);

  expect(b4a.isBuffer(buf)).toBe(true);
  expect(buf.length).toBe(4);
  expect(b4a.equals(buf, b4a.from([1, 2, 3, 4]))).toBe(true);
});

test("isUInt32: should validate if a number is a valid uint32", () => {
  expect(api.utils.isUInt32(1)).toBe(true);
  expect(api.utils.isUInt32(4294967295)).toBe(true);
  expect(api.utils.isUInt32(0)).toBe(true);
  expect(api.utils.isUInt32(4294967296)).toBe(false);
  expect(api.utils.isUInt32(-1)).toBe(false);
  expect(api.utils.isUInt32(3.14)).toBe(false);
  expect(api.utils.isUInt32("string")).toBe(false);
});

test("isHexString: should validate if a string is a valid hex string", () => {
  expect(api.utils.isHexString("abcdef123456")).toBe(true);
  expect(api.utils.isHexString("ABCDEF123456")).toBe(true);
  expect(api.utils.isHexString("xyz123")).toBe(false);
  expect(api.utils.isHexString("12345g")).toBe(false);
  expect(api.utils.isHexString("")).toBe(false);
  expect(api.utils.isHexString(12345)).toBe(false);
});

test("serialize: should serialize buffers and uint32 numbers", () => {
  const buf1 = new Uint8Array([1, 2, 3]);
  const num = 16909060;
  const buf2 = new Uint8Array([5, 6, 7, 8]);

  const serialized = api.utils.serialize(buf1, num, buf2);

  expect(serialized instanceof Uint8Array || b4a.isBuffer(serialized)).toBe(
    true,
  );

  const normalized = b4a.from(serialized);
  expect(
    b4a.equals(normalized, b4a.from([1, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8])),
  ).toBe(true);
});

test("serialize: should throw error on invalid argument types", () => {
  const buf = new Uint8Array([1, 2, 3]);
  const invalidArgs = ["string", {}, null, undefined, 3.14, -1, 4294967296];

  for (const arg of invalidArgs) {
    expect(() => api.utils.serialize(buf, arg)).toThrow();
  }
});

test("toBase64: should return valid base64 data", () => {
  const obj = { foo: "bar", num: 42, hex: "1234567890abcdef" };

  const base64 = api.utils.toBase64(obj);

  expect(typeof base64).toBe("string");

  const decoded = b4a.from(base64, "base64");

  expect(decoded).toBeDefined();
  expect(decoded.length).toBeGreaterThan(0);
});

test("toBase64: should throw error if input is not an object", () => {
  const invalidInputs = ["string", 123, null, undefined];

  for (const input of invalidInputs) {
    expect(() => api.utils.toBase64(input)).toThrow();
  }
});

test("buffer to hex string conversion", () => {
  const { toHexString } = window.TracCryptoApi.utils;

  const sixteenByteBuffer = Uint8Array.from([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, 0x34, 0x56, 0x78,
    0x90, 0xab, 0xcd, 0xef,
  ]);

  const eightByteBuffer = Uint8Array.from([
    0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
  ]);

  const hexString16 = toHexString(sixteenByteBuffer);
  const hexString8 = toHexString(eightByteBuffer);

  expect(hexString16).toBe("00000000000000001234567890abcdef");
  expect(hexString8).toBe("1234567890abcdef");
});

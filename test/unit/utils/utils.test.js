const test = require("brittle");
const api = require("../../../index.js");
const b4a = require("b4a");

test("memzero: should zero out a buffer", (t) => {
  const buf = b4a.from("hello world");
  api.utils.memzero(buf);
  t.ok(buf.every((byte) => byte === 0));
});

test("toUInt32: should convert a number to a 4-byte big-endian buffer", (t) => {
  const num = 16909060; // 0x01020304
  const buf = api.utils.toUInt32(num, 0);
  t.ok(b4a.isBuffer(buf));
  t.is(buf.length, 4);
  t.ok(b4a.equals(buf, b4a.from([1, 2, 3, 4])));
});

test("isUInt32: should validate if a number is a valid uint32", (t) => {
  t.ok(api.utils.isUInt32(1));
  t.ok(api.utils.isUInt32(4294967295)); // Max uint32
  t.ok(api.utils.isUInt32(0)); // Min uint32
  t.not(api.utils.isUInt32(4294967296)); // Above range
  t.not(api.utils.isUInt32(-1)); // Negative number
  t.not(api.utils.isUInt32(3.14)); // Not an integer
  t.not(api.utils.isUInt32("string")); // Not a number
});

test("isHexString: should validate if a string is a valid hex string", (t) => {
  t.ok(api.utils.isHexString("abcdef123456"));
  t.ok(api.utils.isHexString("ABCDEF123456"));
  t.not(api.utils.isHexString("xyz123")); // Invalid characters
  t.not(api.utils.isHexString("12345g")); // Invalid character 'g'
  t.not(api.utils.isHexString("")); // Empty string
  t.not(api.utils.isHexString(12345)); // Not a string
});

test("serialize: should serialize buffers and uint32 numbers", (t) => {
  const buf1 = b4a.from([1, 2, 3]);
  const num = 16909060; // 0x01020304
  const buf2 = b4a.from([5, 6, 7, 8]);
  const serialized = api.utils.serialize(buf1, num, buf2);
  t.ok(b4a.isBuffer(serialized));
  t.ok(b4a.equals(serialized, b4a.from([1, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8])));
});

test("serialize: should throw error on invalid argument types", (t) => {
  const buf = b4a.from([1, 2, 3]);
  const invalidArgs = [
    "string",
    {},
    null,
    undefined,
    3.14, // Not an integer
    -1,   // Negative number
    4294967296, // Above uint32 range
  ];

  for (const arg of invalidArgs) {
    try {
      api.utils.serialize(buf, arg);
      t.fail(`Expected error for argument: ${arg}`);
    } catch (err) {
      t.pass("Has thrown error as expected: " + err.message); // TODO: In the future, assert the error message
    }
  }
});

test("toBase64: should convert an object to a base64 string", (t) => {
  const obj = { foo: "bar", num: 42 };
  const base64 = api.utils.toBase64(obj);
  t.is(typeof base64, "string");
  const decoded = JSON.parse(b4a.from(base64, "base64").toString("utf-8"));
  t.is(decoded.foo, obj.foo);
  t.is(decoded.num, obj.num);
});

test("toBase64: should throw error if input is not an object", (t) => {
  const invalidInputs = [
    "string",
    123,
    null,
    undefined,
  ];

  for (const input of invalidInputs) {
    try {
      api.utils.toBase64(input);
      t.fail(`Expected error for input: ${input}`);
    } catch (err) {
      t.pass("Has thrown error as expected: " + err.message); // TODO: In the future, assert the error message
    }
  }
});
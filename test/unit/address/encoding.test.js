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
  const invalidKeys = [
    null,
    undefined,
    "not a buffer",
    b4a.alloc(10), // Too short
    b4a.alloc(50)  // Too long
  ];
  for (const key of invalidKeys) {
    try {
      api.address.encode(HRP, key);
      t.fail(`Did not throw for key: ${key}`);
    } catch (e) {
      t.pass();
    }
  }
});

test("address.encode: should throw on invalid hrp", async (t) => {
  const invalidHrps = [
    null,
    undefined,
    "",
    "ThisHRPIsWayTooLongToBeValid",
    "invalid*char"
  ];
  for (const hrp of invalidHrps) {
    try {
      const { publicKey } = await api.address.generate("trac");
      api.address.encode(hrp, publicKey);
      t.fail(`Did not throw for HRP: ${hrp}`);
    } catch (e) {
      t.pass();
    }
  }
});

test("address.decode: should throw on invalid address", (t) => {
  const invalidAddresses = [
    null,
    undefined,
    "not a buffer",
    b4a.alloc(10), // Too short
    b4a.alloc(50)  // Too long
  ];
  for (const address of invalidAddresses) {
    try {
      api.address.decode(address);
      t.fail(`Did not throw for address: ${address}`);
    } catch (e) {
      t.pass();
    }
  }
});

test("address.toBuffer/fromBuffer: should convert address to and from buffer correctly", async (t) => {
  const { address } = await api.address.generate(HRP);
  const buf = api.address.toBuffer(address);
  const addrFromBuf = api.address.fromBuffer(buf);
  t.ok(b4a.isBuffer(buf));
  t.is(addrFromBuf, address);
  t.ok(api.address.isValid(addrFromBuf));
});

test("address.toBuffer: should throw on invalid address", (t) => {
  const invalidAddresses = [
    null,
    undefined,
    "",
    "not a valid address",
    "trac1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", // Too short
    "trac1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzo"  // Invalid char
  ];
  for (const address of invalidAddresses) {
    try {
      api.address.toBuffer(address);
      t.fail(`Did not throw for address: ${address}`);
    } catch (e) {
      t.pass();
    }
  }
});

test("address.fromBuffer: should throw on invalid buffer", (t) => {
  const invalidBuffers = [
    null,
    undefined,
    "not a buffer",
    b4a.alloc(10), // Too short
    b4a.alloc(50)  // Too long
  ];
  for (const buf of invalidBuffers) {
    try {
      api.address.fromBuffer(HRP, buf);
      t.fail(`Did not throw for buffer: ${buf}`);
    } catch (e) {
      t.pass();
    }
  }
});

test("address.size: should return correct address size", async (t) => {
  const { address } = await api.address.generate(HRP);
  const size = api.address.size(HRP);
  t.is(size, address.length);
});
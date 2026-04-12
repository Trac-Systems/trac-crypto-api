// operation.test.js
const apiReq = require("trac-crypto-api");
const api = window.TracCryptoApi;
const b4a = window.b4a;

const TRAC_VALIDITY_SIZE_BYTES = 32;
const TRAC_HASH_SIZE = 32;
const TRAC_NONCE_SIZE = 32;
const TRAC_NETWORK_MAINNET_ID = apiReq.MAINNET_ID;

function randomBuf(size) {
  const buf = b4a.alloc(size);
  if (window.sodium && window.sodium.randombytes_buf) {
    window.sodium.randombytes_buf(buf);
  } else if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(buf);
  }
  return buf;
}

test("operation is on window", () => {
  expect(window.TracCryptoApi.operation).toBe(apiReq.operation);
});

test("operation: should build (browser-safe validation)", async () => {
  const fromKeyPair = await api.address.generate("trac");

  const validator = randomBuf(32).toString("hex");
  const contentHash = randomBuf(32).toString("hex");
  const originBootstrap = randomBuf(32).toString("hex");
  const destinationBootstrap = randomBuf(32).toString("hex");
  const validity = randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex");

  const txData = await api.operation.preBuild(
    fromKeyPair.address,
    validator,
    contentHash,
    originBootstrap,
    destinationBootstrap,
    validity,
  );

  expect(txData).toBeDefined();
  expect(txData.from).toBe(fromKeyPair.address);
  expect(txData.hash && txData.hash.length === TRAC_HASH_SIZE).toBe(true);
  expect(txData.nonce && txData.nonce.length === TRAC_NONCE_SIZE).toBe(true);
  expect(txData.networkId).toBe(TRAC_NETWORK_MAINNET_ID);

  expect(api.utils.isHexString(txData.validity)).toBe(true);
  expect(api.utils.isHexString(txData.validator)).toBe(true);
  expect(api.utils.isHexString(txData.contentHash)).toBe(true);
  expect(api.utils.isHexString(txData.originBootstrap)).toBe(true);
  expect(api.utils.isHexString(txData.destinationBootstrap)).toBe(true);

  const payload = api.operation.build(txData, fromKeyPair.secretKey);

  expect(payload).toBeDefined();
  expect(typeof payload).toBe("string");

  const decoded = b4a.from(payload, "base64");

  expect(decoded).toBeDefined();
  expect(decoded.length).toBeGreaterThan(0);
});

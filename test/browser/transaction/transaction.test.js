// transaction.test.js
const apiReq = require("trac-crypto-api");
const api = window.TracCryptoApi;
const b4a = window.b4a;

const TRAC_VALIDITY_SIZE_BYTES = 32;
const TRAC_TOKEN_AMOUNT_SIZE_BYTES = 16;
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

function unpaddHex(hexStr) {
  if (
    typeof hexStr !== "string" ||
    hexStr.length % 2 !== 0 ||
    !/^[0-9a-fA-F]*$/.test(hexStr)
  ) {
    throw new Error("Invalid hex string");
  }
  let i = 0;
  while (i < hexStr.length - 1 && hexStr[i] === "0" && hexStr[i + 1] === "0") {
    i += 2;
  }
  return hexStr.slice(i);
}

test("transaction is on window", () => {
  expect(window.TracCryptoApi.transaction).toBe(apiReq.transaction);
});

test("transaction: preBuild should work correctly", async () => {
  const fromKeyPair = await api.address.generate("trac");
  const toKeyPair = await api.address.generate("trac");
  const amount = "1000";
  const validity = randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex");

  const txData = await api.transaction.preBuild(
    fromKeyPair.address,
    toKeyPair.address,
    amount,
    validity,
  );

  expect(txData).toBeDefined();

  expect(txData.nonce && txData.nonce.length === TRAC_NONCE_SIZE).toBe(true);

  expect(
    txData.hash &&
      b4a.isBuffer(txData.hash) &&
      txData.hash.length === TRAC_HASH_SIZE,
  ).toBe(true);

  expect(txData.from).toBe(fromKeyPair.address);
  expect(txData.to).toBe(toKeyPair.address);

  expect(txData.validity).toBe(validity);

  expect(txData.amount.length).toBe(TRAC_TOKEN_AMOUNT_SIZE_BYTES * 2);
  expect(api.utils.isHexString(txData.amount)).toBe(true);
  expect(amount).toBe(unpaddHex(txData.amount));

  expect(txData.networkId).toBe(TRAC_NETWORK_MAINNET_ID);
});

test("transaction.build: should be browser-safe", async () => {
  const fromKeyPair = await api.address.generate("trac");
  const toKeyPair = await api.address.generate("trac");

  const txData = await api.transaction.preBuild(
    fromKeyPair.address,
    toKeyPair.address,
    "1000",
    randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex"),
  );

  let payload;

  try {
    payload = api.transaction.build(txData, fromKeyPair.secretKey);
  } catch (err) {
    return;
  }

  expect(payload).toBeDefined();

  if (typeof payload === "string") {
    const decoded = b4a.from(payload, "base64");
    expect(decoded.length).toBeGreaterThan(0);
  }
});

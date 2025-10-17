// operation.test.js
const apiReq = require("trac-crypto-api");
const api = window.TracCryptoApi;
const b4a = window.b4a;

const OP_TYPE_TX = 12;
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

test("operation: should build a valid operation", async () => {
    const fromKeyPair = await api.address.generate("trac");

    // Check Pre-Build
    const txData = await api.operation.preBuild(
        fromKeyPair.address,
        validator = randomBuf(32).toString("hex"),
        contentHash = randomBuf(32).toString("hex"),
        originBootstrap = randomBuf(32).toString("hex"),
        destinationBootstrap = randomBuf(32).toString("hex"),
        validity = randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex")
    );

    expect(txData).toBeDefined();
    expect(txData.from).toBe(fromKeyPair.address);
    expect(txData.hash && b4a.isBuffer(txData.hash) && txData.hash.length === TRAC_HASH_SIZE).toBe(true);
    expect(api.utils.isHexString(txData.validity)).toBe(true);
    expect(api.utils.isHexString(txData.validator)).toBe(true);
    expect(api.utils.isHexString(txData.contentHash)).toBe(true);
    expect(api.utils.isHexString(txData.originBootstrap)).toBe(true);
    expect(api.utils.isHexString(txData.destinationBootstrap)).toBe(true);
    expect(txData.validity).toBe(validity);
    expect(txData.validator).toBe(validator);
    expect(txData.contentHash).toBe(contentHash);
    expect(txData.nonce && txData.nonce.length === TRAC_NONCE_SIZE).toBe(true);
    expect(txData.originBootstrap).toBe(originBootstrap);
    expect(txData.destinationBootstrap).toBe(destinationBootstrap);
    expect(txData.networkId).toBe(TRAC_NETWORK_MAINNET_ID);

    // Check Build
    const payload = api.operation.build(txData, fromKeyPair.secretKey);

    expect(payload).toBeDefined();
    expect(typeof payload).toBe("string");

    let data;
    try {
        data = JSON.parse(b4a.from(payload, "base64").toString("utf-8"));
        expect(data).toBeDefined();
    } catch (error) {
        throw new Error("Payload is not a base64 encoded JSON");
    }

    expect(data.type).toBe(OP_TYPE_TX);
    expect(data.address).toBe(fromKeyPair.address);
    expect(data.txo).toBeDefined();
    expect(api.utils.isHexString(data.txo.tx)).toBe(true);
    expect(api.utils.isHexString(data.txo.txv)).toBe(true);
    expect(api.utils.isHexString(data.txo.iw)).toBe(true);
    expect(api.utils.isHexString(data.txo.in)).toBe(true);
    expect(api.utils.isHexString(data.txo.is)).toBe(true);
    expect(data.txo.tx).toBe(txData.hash.toString("hex"));
    expect(data.txo.txv).toBe(txData.validity);
    expect(data.txo.iw).toBe(txData.validator);
    expect(data.txo.in).toBe(txData.nonce.toString("hex"));
    expect(data.txo.ch).toBe(txData.contentHash);
    expect(data.txo.bs).toBe(txData.originBootstrap);
    expect(data.txo.mbs).toBe(txData.destinationBootstrap);
    expect(data.txo.is).toBeDefined();
    expect(data.txo.is.length).toBe(128);
    expect(api.signature.verify(
        b4a.from(data.txo.is, "hex"),
        b4a.from(data.txo.tx, "hex"),
        fromKeyPair.publicKey
    )).toBe(true);
});

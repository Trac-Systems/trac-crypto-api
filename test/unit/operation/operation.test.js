const test = require("brittle");
const api = require("../../../index.js");
const b4a = require("b4a");
const sodium = require("sodium-universal");

const { TRAC_VALIDITY_SIZE_BYTES, TRAC_HASH_SIZE, TRAC_NONCE_SIZE } = require("../../../constants.js");

const OP_TYPE_TX = 12;

function randomBuf(size) {
    const buf = b4a.alloc(size);
    sodium.randombytes_buf(buf);
    return buf;
}

// Happy path test
test("operation: should build a valid operation", async (t) => {
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

    t.ok(txData, "Transaction data should be created");
    t.is(txData.from, fromKeyPair.address, "From address should match");
    t.ok(txData.hash && b4a.isBuffer(txData.hash) && txData.hash.length === TRAC_HASH_SIZE, `Hash should be ${TRAC_HASH_SIZE} bytes buffer`);
    t.is(txData.validity, validity, "Validity should match");
    t.is(txData.validator, validator, "Validator should match");
    t.is(txData.contentHash, contentHash, "Content hash should match");
    t.ok(txData.nonce && txData.nonce.length === TRAC_NONCE_SIZE, `Nonce should be ${TRAC_NONCE_SIZE} bytes`);
    t.is(txData.originBootstrap, originBootstrap, "Origin bootstrap should match");
    t.is(txData.destinationBootstrap, destinationBootstrap, "Destination bootstrap should match");

    // Check Build
    const payload = api.operation.build(txData, fromKeyPair.secretKey);

    t.ok(payload, "Payload should be created");
    t.is(typeof payload, "string", "Payload should be a string");

    let data;
    try {
        data = JSON.parse(b4a.from(payload, "base64").toString("utf-8"));
        t.ok(data, "Payload should be a base64 encoded JSON");
    } catch (error) {
        t.fail("Payload is not a base64 encoded JSON");
    }

    t.is(data.type, OP_TYPE_TX, "Transaction type should be correct");
    t.is(data.address, fromKeyPair.address, "Signed transaction 'from' address should match");
    t.ok(data.txo, "Signed transaction should have 'txo' field");
    t.is(data.txo.tx, txData.hash.toString("hex"), "Signed transaction hash should match");
    t.is(data.txo.txv, txData.validity, "Signed transaction validity should match");
    t.is(data.txo.iw, txData.validator, "Signed transaction validator should match");
    t.is(data.txo.in, txData.nonce.toString("hex"), "Signed transaction nonce should match");
    t.is(data.txo.ch, txData.contentHash, "Signed transaction content hash should match");
    t.is(data.txo.bs, txData.originBootstrap, "Signed transaction origin bootstrap should match");
    t.is(data.txo.mbs, txData.destinationBootstrap, "Signed transaction destination bootstrap should match");
    t.ok(data.txo.is, "Signed transaction should have signature");
    t.is(data.txo.is.length, 128, "Signature should be 64 bytes hex string (128 chars)");
    t.ok(api.signature.verify(
        b4a.from(data.txo.is, "hex"),
        b4a.from(data.txo.tx, "hex"),
        fromKeyPair.publicKey
    ), "Signature should be valid");
});
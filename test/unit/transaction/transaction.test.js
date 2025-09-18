const test = require("brittle");
const api = require("../../../index.js");
const b4a = require("b4a");
const sodium = require("sodium-universal");

const { TRAC_VALIDITY_SIZE_BYTES, TRAC_TOKEN_AMOUNT_SIZE_BYTES, TRAC_HASH_SIZE, TRAC_NONCE_SIZE } = require("../../../constants.js");

const OP_TYPE_TRANSFER = 13;

function randomBuf(size) {
    const buf = b4a.alloc(size);
    sodium.randombytes_buf(buf);
    return buf;
}

function unpaddHex(hexStr) {
    if (typeof hexStr !== 'string' || hexStr.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hexStr)) {
        throw new Error('Invalid hex string');
    }
    let i = 0;
    while (i < hexStr.length - 1 && hexStr[i] === '0' && hexStr[i + 1] === '0') {
        i += 2;
    }
    return hexStr.slice(i);
}

// Happy path test
test("transaction: should build a valid transaction", async (t) => {
    const fromKeyPair = await api.address.generate("trac");
    const toKeyPair = await api.address.generate("trac");
    const amount = "1000";
    const validity = randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex");

    // Check Pre-Build
    const txData = await api.transaction.preBuild(
        fromKeyPair.address,
        toKeyPair.address,
        amount,
        validity
    );

    t.ok(txData, "Transaction data should be created");
    t.ok(txData.nonce && txData.nonce.length === TRAC_NONCE_SIZE, `Nonce should be ${TRAC_NONCE_SIZE} bytes`);
    t.ok(txData.hash && b4a.isBuffer(txData.hash) && txData.hash.length === TRAC_HASH_SIZE, `Hash should be ${TRAC_HASH_SIZE} bytes buffer`);
    t.is(txData.from, fromKeyPair.address, "From address should match");
    t.is(txData.to, toKeyPair.address, "To address should match");
    t.is(txData.validity, validity.toString("hex"), "Validity should match");
    t.is(txData.amount.length, TRAC_TOKEN_AMOUNT_SIZE_BYTES * 2, "Amount should be 16 bytes padded to hex string (32 chars)");
    t.is(amount, unpaddHex(txData.amount), "Amount should match");

    // Check Build
    const payload = api.transaction.build(txData, fromKeyPair.secretKey);

    t.ok(payload, "Payload should be created");
    t.is(typeof payload, "string", "Payload should be a string");

    let data;
    try {
        data = JSON.parse(b4a.from(payload, "base64").toString("utf-8"));
        t.ok(data, "Payload should be a base64 encoded JSON");
    } catch (error) {
        t.fail("Payload is not a base64 encoded JSON");
    }

    t.is(data.type, OP_TYPE_TRANSFER, "Transaction type should be correct");
    t.is(data.address, fromKeyPair.address, "Signed transaction 'from' address should match");
    t.ok(data.tro, "Signed transaction should have 'tro' field");
    t.is(data.tro.tx, txData.hash.toString("hex"), "Signed transaction hash should match");
    t.is(data.tro.to, toKeyPair.address, "Signed transaction 'to' address should match");
    t.is(data.tro.am, txData.amount, "Signed transaction amount should match");
    t.is(data.tro.txv, txData.validity, "Signed transaction validity should match");
    t.is(data.tro.in, txData.nonce.toString("hex"), "Signed transaction nonce should match");
    t.ok(data.tro.is, "Signed transaction should have signature");
    t.is(data.tro.is.length, 128, "Signature should be 64 bytes hex string (128 chars)");
    t.ok(api.signature.verify(
        b4a.from(data.tro.is, "hex"),
        b4a.from(data.tro.tx, "hex"),
        fromKeyPair.publicKey
    ), "Signature should be valid");
});
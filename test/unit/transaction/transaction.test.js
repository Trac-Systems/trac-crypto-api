const test = require("brittle");
const api = require("../../../index.js");
const b4a = require("b4a");
const sodium = require("sodium-universal");

const { TRAC_VALIDITY_SIZE_BYTES, TRAC_TOKEN_AMOUNT_SIZE_BYTES, TRAC_HASH_SIZE, TRAC_NONCE_SIZE, TRAC_NETWORK_MAINNET_ID } = require("../../../constants.js");

const OP_TYPE_TRANSFER = 13;

function randomBuf(size) {
    const buf = b4a.alloc(size);
    sodium.randombytes_buf(buf);
    return buf;
}

const numToHex = (num) => {
    return num.toString(16);
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
    t.is(txData.networkId, TRAC_NETWORK_MAINNET_ID, "Network ID defaults to mainnet");

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

test("transaction preBuild: networkId is used in serialization", async (t) => {
    const fromKeyPair = await api.address.generate("trac");
    const toKeyPair = await api.address.generate("trac");
    const amount = "5000";
    const validity = randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex");
    const customNetworkId = 42;

    const txData = await api.transaction.preBuild(
        fromKeyPair.address,
        toKeyPair.address,
        amount,
        validity,
        customNetworkId
    );

    t.ok(txData, "Transaction data should be created");
    t.is(txData.networkId, customNetworkId, "Network ID should match the custom value provided");
});

test("transaction preBuild: amount is padded correctly", async (t) => {
    const fromKeyPair = await api.address.generate("trac");
    const toKeyPair = await api.address.generate("trac");
    const validity = randomBuf(TRAC_VALIDITY_SIZE_BYTES).toString("hex");

    const testAmounts = [
        { input: "1", expectedHex: "00000000000000000000000000000001" }, // 1/10^18 $TNK
        { input: "ff", expectedHex: "000000000000000000000000000000ff" },
        { input: "3e8", expectedHex: "000000000000000000000000000003e8" }, // 1000/10^18 $TNK
        { input: numToHex(1000), expectedHex: "000000000000000000000000000003e8" }, // 1000/10^18 $TNK
        { input: numToHex(1_000_000_000_000_000_000), expectedHex: "00000000000000000de0b6b3a7640000" }, // 1 $TNK
        { input: numToHex(1_000_000_000_000_000_000_000), expectedHex: "000000000000003635c9adc5dea00000" }, // 1000 $TNK
        { input: "ffffffffffffffffffffffffffffffff", expectedHex: "ffffffffffffffffffffffffffffffff" },
    ];

    for (const { input, expectedHex } of testAmounts) {
        const txData = await api.transaction.preBuild(
            fromKeyPair.address,
            toKeyPair.address,
            input,
            validity
        );

        t.is(txData.amount, expectedHex, `Amount ${input} should be padded correctly to ${expectedHex}`);
    }
});
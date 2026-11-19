const t = require("brittle");

t.test("node env should not have browser globals after loading index", (t) => {
    // Enforce clean state before testing
    delete globalThis.document;
    delete globalThis.location;

    require("../../../index.js");

    t.is(typeof globalThis.document, "undefined");
    t.is(typeof globalThis.location, "undefined");
});

t.test("package should expose named ESM exports alongside the default API", async (t) => {
    const api = require("trac-crypto-api");
    const imported = await import("trac-crypto-api");

    t.is(imported.default, api);
    for (const name of [
        "address", "hash", "mnemonic", "nonce", "signature", "data",
        "utils", "transaction", "operation", "sign", "htlc", "MAINNET_ID", "TESTNET_ID"
    ]) {
        t.ok(api[name], `${name} should exist in the API`);
        t.is(imported[name], api[name], `${name} should support a named import`);
    }
});

t.test("package should expose the constants.js subpath to ESM and CommonJS", async (t) => {
    const api = require("trac-crypto-api");
    const constants = require("trac-crypto-api/constants.js");
    const imported = await import("trac-crypto-api/constants.js");

    t.is(imported.default, constants);
    t.is(imported.TRAC_NETWORK_MAINNET_ID, api.MAINNET_ID);
    t.is(imported.TRAC_NETWORK_TESTNET_ID, api.TESTNET_ID);
});

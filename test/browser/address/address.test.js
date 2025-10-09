// address.test.js
const { address } = require("trac-crypto-api")

const api = window.TracCryptoApi;
const b4a = window.b4a;
const HRP = "trac";
const PATH1 = "m/0'/1'/2'";
const PATH2 = "m/0'/1'/10000000'";
const mnemonic12Words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

// Address encode/decode

test("address is on window", () => {
    expect(window.TracCryptoApi.address).toBe(address)
});

test("address.encode/decode: should encode and decode public key correctly", async () => {
    const { publicKey } = await api.address.generate(HRP);
    const encoded = api.address.encode(HRP, publicKey);
    const decoded = api.address.decode(encoded);
    expect(decoded).toEqual(publicKey);
});

test("address.encode: should throw on invalid public key", () => {
    const invalidKeys = [
        null,
        undefined,
        "not a buffer",
        b4a.alloc(10), // Too short
        b4a.alloc(50)  // Too long
    ];
    for (const key of invalidKeys) {
        expect(() => api.address.encode(HRP, key)).toThrow();
    }
});

test("address.encode: should throw on invalid hrp", async () => {
    const invalidHrps = [
        null,
        undefined,
        "",
        "ThisHRPIsWayTooLongToBeValid",
        "invalid*char"
    ];
    for (const hrp of invalidHrps) {
        const { publicKey } = await api.address.generate(HRP);
        expect(() => api.address.encode(hrp, publicKey)).toThrow();
    }
});

test("address.decode: should throw on invalid address", () => {
    const invalidAddresses = [
        null,
        undefined,
        "not a buffer",
        b4a.alloc(10), // Too short
        b4a.alloc(50)  // Too long
    ];
    for (const address of invalidAddresses) {
        expect(() => api.address.decode(address)).toThrow();
    }
});

test("address.toBuffer/fromBuffer: should convert address to and from buffer correctly", async () => {
    const { address } = await api.address.generate(HRP);
    const buf = api.address.toBuffer(address);
    const addrFromBuf = api.address.fromBuffer(buf);
    expect(b4a.isBuffer(buf)).toBe(true);
    expect(addrFromBuf).toBe(address);
    expect(api.address.isValid(addrFromBuf)).toBe(true);
});

test("address.toBuffer: should throw on invalid address", () => {
    const invalidAddresses = [
        null,
        undefined,
        "not a buffer",
        "short",
        "toolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolong"
    ];
    for (const address of invalidAddresses) {
        expect(() => api.address.toBuffer(address)).toThrow();
    }
});

// Address generate

test("address.generate: should generate a valid address and keypair with no mnemonic input", async () => {
    const result = await api.address.generate(HRP);
    expect(typeof result.address).toBe("string");
    expect(b4a.isBuffer(result.publicKey)).toBe(true);
    expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
    expect(b4a.isBuffer(result.secretKey)).toBe(true);
    expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
    expect(typeof result.mnemonic).toBe("string");
    expect(typeof result.derivationPath).toBe("string");
    expect(result.derivationPath).toBe("m/0'/0'/0'");
});

test("address.generate: should generate keypair for 12 words mnemonic", async () => {
    const mnemonic = mnemonic12Words;
    const result = await api.address.generate(HRP, mnemonic, PATH1);
    expect(b4a.isBuffer(result.publicKey)).toBe(true);
    expect(b4a.isBuffer(result.secretKey)).toBe(true);
    expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
    expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
    expect(result.mnemonic).toBe(mnemonic);
    expect(api.address.isValid(result.address)).toBe(true);
    expect(result.derivationPath).toBe(PATH1);
});

test("address.generate: should generate keypair for 24 words mnemonic", async () => {
    const mnemonic = await api.mnemonic.generate();
    const result = await api.address.generate(HRP, mnemonic, PATH1);
    expect(b4a.isBuffer(result.publicKey)).toBe(true);
    expect(b4a.isBuffer(result.secretKey)).toBe(true);
    expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
    expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
    expect(result.mnemonic).toBe(mnemonic);
    expect(api.address.isValid(result.address)).toBe(true);
    expect(result.derivationPath).toBe(PATH1);
});

test("address.generate: should generate the same keypair for the same mnemonic and derivation path", async () => {
    const mnemonic = await api.mnemonic.generate();
    const result1 = await api.address.generate(HRP, mnemonic, PATH1);
    const result2 = await api.address.generate(HRP, mnemonic, PATH1);
    expect(b4a.equals(result1.publicKey, result2.publicKey)).toBe(true);
    expect(b4a.equals(result1.secretKey, result2.secretKey)).toBe(true);
    expect(result1.mnemonic).toBe(result2.mnemonic);
    expect(result1.address).toBe(result2.address);
    expect(result1.derivationPath).toBe(result2.derivationPath);
    expect(result1.derivationPath).toBe(PATH1);
});

test("address.generate: should generate different keypairs for different mnemonic and same derivation path", async () => {
    const mnemonic1 = await api.mnemonic.generate();
    const mnemonic2 = await api.mnemonic.generate();
    const result1 = await api.address.generate(HRP, mnemonic1, PATH1);
    const result2 = await api.address.generate(HRP, mnemonic2, PATH1);
    expect(b4a.equals(result1.publicKey, result2.publicKey)).toBe(false);
    expect(b4a.equals(result1.secretKey, result2.secretKey)).toBe(false);
    expect(result1.address).not.toBe(result2.address);
    expect(result1.derivationPath).toBe(result2.derivationPath);
    expect(result1.derivationPath).toBe(PATH1);
});

test("address.generate: should generate different keypairs for the same mnemonic and different derivation path", async () => {
    const mnemonic = await api.mnemonic.generate();
    const result1 = await api.address.generate(HRP, mnemonic, PATH1);
    const result2 = await api.address.generate(HRP, mnemonic, PATH2);
    expect(b4a.equals(result1.publicKey, result2.publicKey)).toBe(false);
    expect(b4a.equals(result1.secretKey, result2.secretKey)).toBe(false);
    expect(result1.address).not.toBe(result2.address);
    expect(result1.derivationPath).toBe(PATH1);
    expect(result2.derivationPath).toBe(PATH2);
});

test("address.generate: should return an error for invalid mnemonic", async () => {
    const invalidMnemonics = [
        "",
        "   ",
        "invalid mnemonic",
        "abandon abandon abandon",
        "abandon ".repeat(25).trim(),
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about extra",
    ];
    for (const mnemonic of invalidMnemonics) {
        await expect(api.address.generate(HRP, mnemonic)).rejects.toThrow();
    }
});

test("should accept valid hrp", async () => {
    const validHrps = [
        "t",
        "trac",
        "a".repeat(31),
    ];
    for (const hrp of validHrps) {
        const result = await api.address.generate(hrp);
        expect(typeof result.address).toBe("string");
        expect(b4a.isBuffer(result.publicKey)).toBe(true);
        expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
        expect(b4a.isBuffer(result.secretKey)).toBe(true);
        expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
        expect(typeof result.mnemonic).toBe("string");
        expect(typeof result.derivationPath).toBe("string");
    }
});

test("address.generate: should return an error for invalid hrp", async () => {
    const invalidHrps = [
        {},
        "",
        "   ",
        "a".repeat(32),
        "Trac",
        "tr@c",
        "trac-hrp",
        "trac_hrp",
        "тест",
        "hrp1",
        "hrp2",
    ];
    for (const hrp of invalidHrps) {
        await expect(api.address.generate(hrp)).rejects.toThrow();
    }
});

test("address.generate: should accept valid derivation paths", async () => {
    const mnemonic = await api.mnemonic.generate();
    const paths = [
        undefined,
        null,
        "m/0'",
        "m/0'/1'",
        "m/0'   /1'",
        "m/44'/60'" + "/0'".repeat(256),
        "m/2147483647'/2147483646'/2147483645'",
    ];
    for (const path of paths) {
        const result = await api.address.generate(HRP, mnemonic, path);
        expect(typeof result.address).toBe("string");
        expect(b4a.isBuffer(result.publicKey)).toBe(true);
        expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
        expect(b4a.isBuffer(result.secretKey)).toBe(true);
        expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
        expect(typeof result.mnemonic).toBe("string");
        expect(typeof result.derivationPath).toBe("string");
        if (typeof path !== "string") {
            expect(result.derivationPath).toBe("m/0'/0'/0'");
        } else {
            expect(result.derivationPath).toBe(path.replace(/\s+/g, ''));
        }
        expect(api.address.isValid(result.address)).toBe(true);
    }
});

test("address.generate: equivalent paths should produce the same result", async () => {
    const mnemonic = await api.mnemonic.generate();
    const result1 = await api.address.generate(HRP, mnemonic, "m/0'/1'");
    const result2 = await api.address.generate(HRP, mnemonic, "m/0'   /1'");
    expect(b4a.equals(result1.publicKey, result2.publicKey)).toBe(true);
    expect(b4a.equals(result1.secretKey, result2.secretKey)).toBe(true);
    expect(result1.mnemonic).toBe(result2.mnemonic);
    expect(result1.address).toBe(result2.address);
    expect(result1.derivationPath).toBe(result2.derivationPath);
});

test("address.generate: should throw an error for invalid derivation paths", async () => {
    const paths = [
        1234,
        { valid: false },
        "invalid_path",
        "m/",
        "m/a'",
        "m/0/1",
        "m/0'/1/2'",
        "m/2147483648'/2147483647'/2147483646'",
        "n/0'/1'",
        "",
        "   ",
    ];
    const mnemonic = await api.mnemonic.generate();
    for (const path of paths) {
        await expect(api.address.generate(HRP, mnemonic, path)).rejects.toThrow();
    }
});

test("address.fromSecretKey: should derive the correct address and public key from a given secret key", async () => {
    const original = await api.address.generate(HRP);
    const derived = api.address.fromSecretKey(HRP, original.secretKey);
    expect(derived.address).toBe(original.address);
    expect(b4a.equals(derived.publicKey, original.publicKey)).toBe(true);
    expect(b4a.equals(derived.secretKey, original.secretKey)).toBe(true);
});

test("address.fromSecretKey: should throw on invalid secret key", async () => {
    const invalidKeys = [
        b4a.alloc(10),
        b4a.alloc(100),
        "not a buffer",
        12345,
        null,
        undefined,
    ];
    for (const key of invalidKeys) {
        expect(() => api.address.fromSecretKey(HRP, key)).toThrow();
    }
});

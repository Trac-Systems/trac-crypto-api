const api = window.TracCryptoApi;
const b4a = window.b4a;

const HRP = 'trac';
const PATH1 = "m/0'/1'/2'";
const PATH2 = "m/0'/1'/10000000'";

const mnemonic12Words = 'army van defense carry jealous true garbage claim echo media make crunch';
const mnemonic24Words = 'success color master trumpet receive side file connect oyster fury reopen peasant tuna fire shrug budget master tragic mystery young wealth marine digital enter';
const DEFAULT_DERIVATION_PATH = "m/918'/0'/0'/0'";

test('address is on window', () => {
    expect(api.address).toBeDefined();
});

// encode/decode

test('address.encode/decode', async () => {
    const { publicKey } = await api.address.generate(HRP);
    const encoded = api.address.encode(HRP, publicKey);
    const decoded = api.address.decode(encoded);

    expect(b4a.equals(decoded, publicKey)).toBe(true);
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
        '',
        ' ',
        'A',
        'tr@c',
        'trac_hrp',
        'hrp1',
        'hrp2',
        'ThisHRPIsWayTooLongToBeValid',
        "invalid*char"
    ];

    for (const hrp of invalidHrps) {
        const { publicKey } = await api.address.generate(HRP);
        expect(() => api.address.encode(hrp, publicKey)).toThrow();
    }
});

test("address.decode: should throw on invalid address", () => {
    const invalid = [
        null, 
        undefined, 
        "not a buffer",
        b4a.alloc(10), // Too short
        b4a.alloc(50)  // Too long
    ];

    for (const addr of invalid) {
        expect(() => api.address.decode(addr)).toThrow();
    }
});

// buffer

test("address.toBuffer/fromBuffer: should convert address to and from buffer correctly", async () => {
    const { address } = await api.address.generate(HRP);
    const buf = api.address.toBuffer(address);
    const addr = api.address.fromBuffer(buf);

    expect(b4a.isBuffer(buf)).toBe(true);
    expect(api.address.isValid(addr)).toBe(true);
    expect(addr).toBe(address);
});

test("address.toBuffer: should throw on invalid address", () => {
    const invalid = [
        null,
        undefined,
        'short',
        'not a buffer',
        'x'.repeat(200),
        'toolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolong'
    ];

    for (const addr of invalid) {
        expect(() => api.address.toBuffer(addr)).toThrow();
    }
});

test("address.generate: should generate a valid address and keypair with no mnemonic input", async () => {
    const result = await api.address.generate(HRP);

    expect(typeof result.address).toBe('string');
    expect(b4a.isBuffer(result.publicKey)).toBe(true);
    expect(b4a.isBuffer(result.secretKey)).toBe(true);
    expect(result.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
    expect(result.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
    expect(api.address.isValid(result.address)).toBe(true);
    expect(typeof result.mnemonic).toBe("string");
    expect(typeof result.derivationPath).toBe("string");
    expect(result.derivationPath).toBe(DEFAULT_DERIVATION_PATH);
});

// mnemonic

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
    const mnemonic = mnemonic24Words;
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

test('address.generate: equivalent paths', async () => {
    const mnemonic = await api.mnemonic.generate();
    const r1 = await api.address.generate(HRP, mnemonic, "m/0'/1'");
    const r2 = await api.address.generate(HRP, mnemonic, "m/0'   /1'");

    expect(b4a.equals(r1.publicKey, r2.publicKey)).toBe(true);
});

// invalid mnemonic (expanded)

test("address.generate: should return an error for invalid mnemonic", async () => {
    const invalidMnemonics = [
        '',
        '   ',
        'invalid mnemonic',
        'abandon abandon abandon',
        'abandon '.repeat(25).trim(),
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about extra',
    ];

     for (const mnemonic of invalidMnemonics) {
        await expect(api.address.generate(HRP, mnemonic)).rejects.toThrow();
    }
});

test("address.generate: should accept valid hrp", async () => {
    const validHrps = [
        't', 
        'trac', 
        'a'.repeat(31)
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
        '',
        '   ',
        {},
        'Trac',
        'tr@c',
        'trac-hrp',
        'тест',
        'a'.repeat(32),
        'trac_hrp',
        'hrp1',
        'hrp2'
    ];

    for (const hrp of invalidHrps) {
        await expect(api.address.generate(hrp)).rejects.toThrow();
    }
});

// derivation paths

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
        const r = await api.address.generate(HRP, mnemonic, path);

        expect(typeof r.address).toBe('string');
        expect(b4a.isBuffer(r.publicKey)).toBe(true);
        expect(r.publicKey.length).toBe(api.address.PUB_KEY_SIZE);
        expect(b4a.isBuffer(r.secretKey)).toBe(true);
        expect(r.secretKey.length).toBe(api.address.PRIV_KEY_SIZE);
        expect(typeof r.mnemonic).toBe('string');
        expect(typeof r.derivationPath).toBe('string');

        if (typeof path !== 'string') {
            expect(r.derivationPath).toBe(DEFAULT_DERIVATION_PATH);
        } else {
            expect(r.derivationPath).toBe(path.replace(/\s+/g, ''));
        }

        expect(api.address.isValid(r.address)).toBe(true);
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
    const mnemonic = await api.mnemonic.generate();
    const paths = [
        1234,
        {},
        { valid: false },
        "invalid_path",
        "m/",
        "m/a'",
        "m/0/1",
        "m/0'/1/2'",
        "n/0'/1'",
        "m/2147483648'/2147483647'/2147483646'",
        "   ",
        ""
    ];

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

test('mnemonic.generate: should produce valid 12 or 24 words', async () => {
    const mnemonic = await api.mnemonic.generate();

    expect(typeof mnemonic).toBe('string');

    const words = mnemonic.trim().split(/\s+/);
    expect([12, 24]).toContain(words.length);

    // sanity: can generate address
    const r = await api.address.generate(HRP, mnemonic, PATH1);
    expect(api.address.isValid(r.address)).toBe(true);
});

test('address.generate: deterministic (24 words)', async () => {
    const r1 = await api.address.generate(HRP, mnemonic24Words, PATH1);
    const r2 = await api.address.generate(HRP, mnemonic24Words, PATH1);

    expect(b4a.equals(r1.publicKey, r2.publicKey)).toBe(true);
    expect(b4a.equals(r1.secretKey, r2.secretKey)).toBe(true);
    expect(r1.address).toBe(r2.address);
    expect(r1.mnemonic).toBe(mnemonic24Words);
});
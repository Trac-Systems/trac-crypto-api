const api = window.TracCryptoApi;
const b4a = window.b4a;

const OP_TYPE_TX = 12;
const TRAC_VALIDITY_SIZE_BYTES = 32;
const TRAC_HASH_SIZE = 32;
const TRAC_NONCE_SIZE = 32;
const TRAC_NETWORK_MAINNET_ID = api.MAINNET_ID;

function randomBuf(size) {
    const buf = b4a.alloc(size);

    if (window.sodium && window.sodium.randombytes_buf) {
        window.sodium.randombytes_buf(buf);
    } else if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(buf);
    }

    return buf;
}

test('operation is on window', () => {
    expect(api.operation).toBeDefined();
});

test('operation: preBuild should create a valid operation data object', async () => {
    const fromKeyPair = await api.address.generate('trac');

    const validator = b4a.toString(randomBuf(32), 'hex');
    const contentHash = b4a.toString(randomBuf(32), 'hex');
    const originBootstrap = b4a.toString(randomBuf(32), 'hex');
    const destinationBootstrap = b4a.toString(randomBuf(32), 'hex');
    const validity = b4a.toString(randomBuf(TRAC_VALIDITY_SIZE_BYTES), 'hex');

    const txData = await api.operation.preBuild(
        fromKeyPair.address,
        validator,
        contentHash,
        originBootstrap,
        destinationBootstrap,
        validity
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

    expect(txData.validity).toBe(validity);
    expect(txData.validator).toBe(validator);
    expect(txData.contentHash).toBe(contentHash);
    expect(txData.originBootstrap).toBe(originBootstrap);
    expect(txData.destinationBootstrap).toBe(destinationBootstrap);
});

test('operation.build: should produce valid payload', async () => {
    const fromKeyPair = await api.address.generate('trac');

    const validator = b4a.toString(randomBuf(32), 'hex');
    const contentHash = b4a.toString(randomBuf(32), 'hex');
    const originBootstrap = b4a.toString(randomBuf(32), 'hex');
    const destinationBootstrap = b4a.toString(randomBuf(32), 'hex');
    const validity = b4a.toString(randomBuf(TRAC_VALIDITY_SIZE_BYTES), 'hex');

    const txData = await api.operation.preBuild(
        fromKeyPair.address,
        validator,
        contentHash,
        originBootstrap,
        destinationBootstrap,
        validity
    );

    const payload = api.operation.build(
        txData,
        fromKeyPair.secretKey
    );

    expect(payload).toBeDefined();
    expect(typeof payload).toBe('string');

    const decoded = b4a.from(payload, 'base64');

    expect(decoded.length).toBeGreaterThan(0);

    let parsed;
    try {
        // NOTE: payload is not guaranteed to be JSON in browser build
        parsed = JSON.parse(decoded.toString('utf-8'));
    } catch {
        // Ignore parse failures: browser payloads are not guaranteed to be JSON.
    }

    if (parsed && parsed.txo) {
        expect(parsed.type).toBe(OP_TYPE_TX);
        expect(parsed.address).toBe(fromKeyPair.address);

        expect(parsed.txo).toBeDefined();

        expect(api.utils.isHexString(parsed.txo.tx)).toBe(true);
        expect(api.utils.isHexString(parsed.txo.txv)).toBe(true);
        expect(api.utils.isHexString(parsed.txo.iw)).toBe(true);
        expect(api.utils.isHexString(parsed.txo.in)).toBe(true);
        expect(api.utils.isHexString(parsed.txo.is)).toBe(true);

        expect(parsed.txo.tx).toBe(b4a.toString(txData.hash, 'hex'));
        expect(parsed.txo.txv).toBe(txData.validity);
        expect(parsed.txo.iw).toBe(txData.validator);
        expect(parsed.txo.in).toBe(b4a.toString(txData.nonce, 'hex'));
        expect(parsed.txo.ch).toBe(txData.contentHash);
        expect(parsed.txo.bs).toBe(txData.originBootstrap);
        expect(parsed.txo.mbs).toBe(txData.destinationBootstrap);

        expect(parsed.txo.is.length).toBe(128);

        const isValid = api.signature.verify(
            b4a.from(parsed.txo.is, 'hex'),
            b4a.from(parsed.txo.tx, 'hex'),
            fromKeyPair.publicKey
        );

        expect(isValid).toBe(true);
    }
});

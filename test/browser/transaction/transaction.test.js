const api = window.TracCryptoApi;
const b4a = window.b4a;
const OP_TYPE_TRANSFER = 13;
const TRAC_VALIDITY_SIZE_BYTES = 32;
const TRAC_TOKEN_AMOUNT_SIZE_BYTES = 16;
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

test('transaction is on window', () => {
    expect(api.transaction).toBeDefined();
});

test('transaction.preBuild: should generate an unsigned transaction message', async () => {
    const fromKeyPair = await api.address.generate('trac');
    const toKeyPair = await api.address.generate('trac');
    const amount = '1000';
    const validity = b4a.toString(randomBuf(TRAC_VALIDITY_SIZE_BYTES), 'hex');
    const txData = await api.transaction.preBuild(fromKeyPair.address, toKeyPair.address, amount, validity);

    expect(txData).toBeDefined();
    expect(txData.nonce && txData.nonce.length === TRAC_NONCE_SIZE).toBe(true);
    expect(txData.hash && txData.hash.length === TRAC_HASH_SIZE).toBe(true);
    expect(txData.from).toBe(fromKeyPair.address);
    expect(txData.to).toBe(toKeyPair.address);
    expect(txData.validity).toBe(validity);
    expect(txData.amount.length).toBe(TRAC_TOKEN_AMOUNT_SIZE_BYTES * 2);
    expect(api.utils.isHexString(txData.amount)).toBe(true);
    expect(unpaddHex(txData.amount)).toBe(amount);
    expect(txData.networkId).toBe(TRAC_NETWORK_MAINNET_ID);
});

test('transaction.build: should finalize a pre built transaction message', async () => {
    const amount = '1000';
    const fromKeyPair = await api.address.generate('trac');
    const toKeyPair = await api.address.generate('trac');
    const txData = await api.transaction.preBuild(
        fromKeyPair.address, 
        toKeyPair.address, 
        amount, 
        b4a.toString(randomBuf(TRAC_VALIDITY_SIZE_BYTES), 'hex')
    );
    const payload = api.transaction.build(txData, fromKeyPair.secretKey);

    expect(payload).toBeDefined();
    expect(typeof payload).toBe('string');

    const decodedPayload = b4a.from(payload, 'base64');
    expect(decodedPayload.length).toBeGreaterThan(0);

    const data = JSON.parse(b4a.toString(decodedPayload, "utf-8"));
    expect(data).toBeDefined();
    expect(data.tro).toBeDefined();
    expect(data.type).toBe(OP_TYPE_TRANSFER);
    expect(data.address).toBe(fromKeyPair.address);
    expect(data.tro).toBeDefined();
    expect(api.utils.isHexString(data.tro.tx)).toBe(true);
    expect(data.tro.tx).toBe(b4a.toString(txData.hash, "hex"));
    expect(data.tro.to).toBe(toKeyPair.address);
    expect(data.tro.am).toBe(txData.amount);
    expect(data.tro.txv).toBe(txData.validity);
    expect(api.utils.isHexString(data.tro.in)).toBe(true);
    expect(data.tro.in).toBe(b4a.toString(txData.nonce, "hex"));
    expect(data.tro.is).toBeDefined();
    expect(data.tro.is.length).toBe(128);
    
    const isValid = api.signature.verify(
        b4a.from(data.tro.is, 'hex'), 
        b4a.from(data.tro.tx, 'hex'), 
        fromKeyPair.publicKey
    );

    expect(isValid).toBe(true);
});
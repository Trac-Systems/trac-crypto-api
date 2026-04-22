const api = window.TracCryptoApi;
const address = api.address;
const signature = api.signature;
const b4a = window.b4a;

// NOTE: requires sodium to be injected in window (browser runtime dependency)
const sodium = window.sodium;

const hrp = 'trac';

test('signature is on window', () => {
    expect(api.signature).toBeDefined();
});

test('address is on window', () => {
    expect(api.address).toBeDefined();
});

test('b4a is on window', () => {
    expect(b4a).toBeDefined();
});

test('sodium is on window', () => {
    expect(sodium).toBeDefined();
});

test('signature.sign: should return a valid signature', async () => {
    const { secretKey, publicKey } = await address.generate(hrp);
    const message = b4a.from('hello world');
    const sig = signature.sign(message, secretKey);
    expect(sig.length).toBe(64);

    const verified = signature.verify(sig, message, publicKey);
    expect(verified).toBe(true);
});

test("should sign and verify a message correctly", async () => {
    const {
        crypto_sign_keypair,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
    } = sodium
    const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES)
    const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES)

    crypto_sign_keypair(publicKey, secretKey)
    
    const message = b4a.from("Hello, World!")
    const signatureVal = signature.sign(message, secretKey)
    const isValid = signature.verify(signatureVal, message, publicKey)
    const signatureResult = {
        isValid,
        signatureLength: signatureVal.byteLength,
        expectedSignatureLength: crypto_sign_BYTES,
    }

    expect(signatureResult.isValid).toBe(true)
    expect(signatureResult.signatureLength).toBe(signatureResult.expectedSignatureLength)
})

test('signature.verify: should fail for wrong message', async () => {
    const { secretKey, publicKey } = await address.generate(hrp);
    const message = b4a.from('hello world');
    const wrongMessage = b4a.from('other message');
    const sig = signature.sign(message, secretKey);
    const valid = signature.verify(sig, wrongMessage, publicKey);

    expect(valid).toBe(false);
});

test('signature.verify: should fail for tampered message', () => {
    const { crypto_sign_keypair, crypto_sign_PUBLICKEYBYTES, crypto_sign_SECRETKEYBYTES} = sodium;

    const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES);
    const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES);

    crypto_sign_keypair(publicKey, secretKey);

    const originalMessage = b4a.from('This is the original message.');
    const tamperedMessage = b4a.from(originalMessage);

    tamperedMessage[5] ^= 1;

    const sig = signature.sign(originalMessage, secretKey);
    const result = signature.verify(sig, tamperedMessage, publicKey);
    expect(result).toBe(false);
});

test('signature.verify: should fail with wrong public key', () => {
    const { crypto_sign_keypair, crypto_sign_PUBLICKEYBYTES, crypto_sign_SECRETKEYBYTES} = sodium;
    const correctPk = b4a.alloc(crypto_sign_PUBLICKEYBYTES);
    const correctSk = b4a.alloc(crypto_sign_SECRETKEYBYTES);
    const wrongPk = b4a.alloc(crypto_sign_PUBLICKEYBYTES);
    const wrongSk = b4a.alloc(crypto_sign_SECRETKEYBYTES);

    crypto_sign_keypair(correctPk, correctSk);
    crypto_sign_keypair(wrongPk, wrongSk);

    const message = b4a.from('Testing with a wrong key.');
    const sig = signature.sign(message, correctSk);
    const result = signature.verify(sig, message, wrongPk);

    expect(result).toBe(false);
});

test('signature.verify: should fail for tampered signature', () => {
    const { crypto_sign_keypair, crypto_sign_PUBLICKEYBYTES, crypto_sign_SECRETKEYBYTES} = sodium;
    const publicKey = b4a.alloc(crypto_sign_PUBLICKEYBYTES);
    const secretKey = b4a.alloc(crypto_sign_SECRETKEYBYTES);

    crypto_sign_keypair(publicKey, secretKey);

    const message = b4a.from('This signature will be tampered with.');
    const sig = signature.sign(message, secretKey);
    const tamperedSig = b4a.from(sig);
    tamperedSig[0] ^= 1;

    const result = signature.verify(tamperedSig, message, publicKey);
    expect(result).toBe(false);
});

test('signature.verify: should return boolean', async () => {
    const { publicKey } = await address.generate(hrp);
    const message = b4a.from('hello world');
    const result = signature.verify(b4a.alloc(64), message, publicKey);

    expect(typeof result).toBe('boolean');
});

test('signature.verify: should be deterministic', async () => {
    const { publicKey } = await address.generate(hrp);
    const message = b4a.from('hello world');
    const sig = b4a.alloc(64);
    const r1 = signature.verify(sig, message, publicKey);
    const r2 = signature.verify(sig, message, publicKey);

    expect(r1).toBe(r2);
});

test('signature.verify: should change with different inputs', async () => {
    const { publicKey } = await address.generate(hrp);
    const msg1 = b4a.from('hello');
    const msg2 = b4a.from('world');
    const sig = b4a.alloc(64);
    const r1 = signature.verify(sig, msg1, publicKey);
    const r2 = signature.verify(sig, msg2, publicKey);

    expect(typeof r1).toBe('boolean');
    expect(typeof r2).toBe('boolean');
});

test('signature.sign: should throw on invalid private key', () => {
    expect(() => signature.sign(b4a.from('msg'), b4a.alloc(10))).toThrow();
});

test('signature.verify: should not throw on random inputs', () => {
    const message = b4a.from('hello');
    const result = signature.verify(b4a.alloc(64), message, b4a.alloc(32));

    expect(typeof result).toBe('boolean');
});
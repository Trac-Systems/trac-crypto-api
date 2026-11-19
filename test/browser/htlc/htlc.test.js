const api = window.TracCryptoApi;
const b4a = window.b4a;
const {vectors} = require('../../fixtures/htlc.json');

function secretKey(seed) {
    const key = b4a.alloc(64);
    window.sodium.crypto_sign_seed_keypair(b4a.alloc(32), key, b4a.alloc(32, seed));
    return key;
}

for (const vector of vectors) {
    test(`HTLC browser matches MSB: ${vector.name}`, async () => {
        const {operation, from, validity, networkId, terms: lockTerms, lockId, preimage, nonce} = vector;
        let data;
        if (operation === 'lock') data = await api.htlc.lock.preBuild(from, lockTerms, validity, networkId);
        if (operation === 'claim') data = await api.htlc.claim.preBuild(from, lockId, preimage, validity, networkId, {nonce});
        if (operation === 'refund') data = await api.htlc.refund.preBuild(from, lockId, validity, networkId, {nonce});
        const payload = await api.htlc[operation].build(data, secretKey(vector.signerSeed), vector.cosignerSignatures);
        expect(JSON.parse(b4a.toString(b4a.from(payload, 'base64'), 'utf8'))).toEqual(vector.expected);
    });
}

test('HTLC browser: hex metadata, keys and nonce preserve binary values', async () => {
    const vector = vectors[0];
    const data = await api.htlc.lock.preBuild(vector.from, {
        ...vector.terms, metadata: '0080FF', refundEpoch: '20000000000001',
        nonce: '22'.repeat(32),
        signerSet: vector.terms.signerSet.map(key => key.toUpperCase()),
    }, vector.validity);
    expect(data.metadata).toBe('0080ff');
    expect(data.refundEpoch).toBe('0020000000000001');
    const payload = await api.htlc.lock.build(data, new Uint8Array(secretKey(1)));
    expect(JSON.parse(b4a.toString(b4a.from(payload, 'base64'), 'utf8')).hlo.md).toBe('0080ff');
    await expect(api.htlc.lock.build({...data, metadata: '00'}, secretKey(1))).rejects.toThrow(/does not match its hash/);
});

test('HTLC browser: generated nonce and SHA-256 preimage can be used in a lock', async () => {
    const vector = vectors[0];
    const preimage = api.nonce.generate();
    const data = await api.htlc.lock.preBuild(vector.from, {
        ...vector.terms, hashLock: api.utils.toHexString(api.hash.sha256(preimage)), nonce: undefined,
    }, vector.validity);
    expect(data.nonce.length).toBe(32);
    expect(typeof await api.htlc.lock.build(data, secretKey(1))).toBe('string');
});

test('HTLC browser: all lock byte inputs require hex strings', async () => {
    const vector = vectors[0];
    const lockTerms = {...vector.terms, metadata: '0080ff'};
    for (const field of ['amount', 'feeAmount', 'hashLock', 'refundEpoch', 'metadata', 'nonce']) {
        const bytes = new Uint8Array(b4a.from(lockTerms[field], 'hex'));
        await expect(api.htlc.lock.preBuild(vector.from, {
            ...lockTerms, [field]: bytes,
        }, vector.validity)).rejects.toThrow(new RegExp(field));
    }
    await expect(api.htlc.lock.preBuild(vector.from, lockTerms, b4a.from(vector.validity, 'hex'))).rejects.toThrow(/validity.*hex string/);
    await expect(api.htlc.lock.preBuild(vector.from, {
        ...lockTerms, signerSet: lockTerms.signerSet.map(key => b4a.from(key, 'hex')),
    }, vector.validity)).rejects.toThrow(/signerSet.*hex string/);

    const multisig = vectors.find(item => item.cosignerSignatures?.length > 0);
    const data = await api.htlc.lock.preBuild(multisig.from, multisig.terms, multisig.validity, multisig.networkId);
    await expect(api.htlc.lock.build(data, secretKey(multisig.signerSeed),
        multisig.cosignerSignatures.map(signature => b4a.from(signature, 'hex')),
    )).rejects.toThrow(/cosigner signature.*hex string/);
});

test('HTLC browser: claim and refund byte inputs require hex strings', async () => {
    for (const operation of ['claim', 'refund']) {
        const vector = vectors.find(item => item.operation === operation);
        const fields = operation === 'claim' ? ['lockId', 'preimage', 'validity', 'nonce'] : ['lockId', 'validity', 'nonce'];
        for (const field of fields) {
            const data = {...vector, [field]: new Uint8Array(b4a.from(vector[field], 'hex'))};
            const pending = operation === 'claim'
                ? api.htlc.claim.preBuild(data.from, data.lockId, data.preimage, data.validity, data.networkId, {nonce: data.nonce})
                : api.htlc.refund.preBuild(data.from, data.lockId, data.validity, data.networkId, {nonce: data.nonce});
            await expect(pending).rejects.toThrow(new RegExp(`${field}.*hex string`));
        }
    }
});

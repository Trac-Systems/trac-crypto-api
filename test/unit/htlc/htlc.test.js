const test = require('brittle');
const b4a = require('b4a');
const sodium = require('sodium-universal');
const api = require('../../../index.js');
const {vectors} = require('../../fixtures/htlc.json');

function wallet(seed, prefix = 'trac') {
    const publicKey = b4a.alloc(32);
    const secretKey = b4a.alloc(64);
    sodium.crypto_sign_seed_keypair(publicKey, secretKey, b4a.alloc(32, seed));
    return {publicKey, publicKeyHex: api.utils.toHexString(publicKey), secretKey, address: api.address.encode(prefix, publicKey)};
}

function signHex(hash, signer) {
    return api.utils.toHexString(api.signature.sign(hash, signer.secretKey));
}

function decode(payload) {
    return JSON.parse(b4a.toString(b4a.from(payload, 'base64'), 'utf8'));
}

const single = vectors[0];
const maker = wallet(1);
const recipient = wallet(2);
const lock = overrides => api.htlc.lock.preBuild(single.from, {...single.terms, ...overrides}, single.validity);

for (const vector of vectors) {
    test(`HTLC MSB reference: ${vector.name}`, async t => {
        const {operation, from, validity, networkId, nonce, lockId, preimage, terms: lockTerms} = vector;
        let data;
        if (operation === 'lock') data = await api.htlc.lock.preBuild(from, lockTerms, validity, networkId);
        if (operation === 'claim') data = await api.htlc.claim.preBuild(from, lockId, preimage, validity, networkId, {nonce});
        if (operation === 'refund') data = await api.htlc.refund.preBuild(from, lockId, validity, networkId, {nonce});
        const payload = await api.htlc[operation].build(data, wallet(vector.signerSeed).secretKey, vector.cosignerSignatures);
        t.alike(decode(payload), vector.expected, 'complete partial payload matches the MSB builder, including its signature');
        t.ok(b4a.isBuffer(data.hash));
        t.is(data.hash.length, 32);
        t.ok(b4a.isBuffer(data.nonce));
        t.is(data.nonce.length, 32);
    });
}

test('HTLC lock: defaults produce a single-signer lock without optional fields', async t => {
    const data = await lock({feeAmount: undefined, signerSet: undefined, threshold: undefined});
    const payload = decode(await api.htlc.lock.build(data, maker.secretKey));
    t.alike(payload, single.expected);
    t.absent(Object.hasOwn(payload.hlo, 'md'));
    t.absent(Object.hasOwn(payload.hlo, 'fr'));
    t.absent(Object.hasOwn(payload.hlo, 'va'));
    t.absent(Object.hasOwn(payload, 'networkId'));
});

test('HTLC lock: hex inputs are snapshotted and integers have fixed widths', async t => {
    const lockTerms = {...single.terms, amount: '1', refundEpoch: '64', metadata: '0080FF', signerSet: [maker.publicKeyHex]};
    const pending = api.htlc.lock.preBuild(single.from, lockTerms, single.validity);
    lockTerms.nonce = '00'.repeat(32);
    lockTerms.metadata = '00';
    lockTerms.signerSet[0] = recipient.publicKeyHex;
    const data = await pending;
    t.is(data.amount, '00000000000000000000000000000001');
    t.is(data.refundEpoch, '0000000000000064');
    t.is(data.metadata, '0080ff');
    t.is(api.utils.toHexString(data.nonce), '22'.repeat(32));
    t.is(data.signerSet[0], api.utils.toHexString(maker.publicKey));
    const fromShortHex = await lock({refundEpoch: '64'});
    const fromPaddedHex = await lock({refundEpoch: '0000000000000064'});
    t.alike(fromShortHex.hash, fromPaddedHex.hash);
    const largeEpoch = await lock({refundEpoch: '20000000000001'});
    t.is(largeEpoch.refundEpoch, '0020000000000001', 'uint64 does not lose precision');
});

test('HTLC lock: amount, feeAmount, hashLock and refundEpoch accept only hex strings', async t => {
    for (const field of ['amount', 'feeAmount', 'hashLock', 'refundEpoch']) {
        const validHex = single.terms[field];
        for (const value of [
            b4a.from(validHex, 'hex'),
            new Uint8Array(b4a.from(validHex, 'hex')),
            1n, 1, null, '', '0x01',
        ]) {
            await t.exception(() => lock({[field]: value}), new RegExp(field));
        }
    }

    const data = await lock({
        amount: 'ABC',
        feeAmount: 'F',
        feeRecipient: recipient.address,
        hashLock: single.terms.hashLock.toUpperCase(),
        refundEpoch: 'ABC',
    });
    t.is(data.amount, '00000000000000000000000000000abc');
    t.is(data.feeAmount, '0000000000000000000000000000000f');
    t.is(data.hashLock, single.terms.hashLock);
    t.is(data.refundEpoch, '0000000000000abc');
    t.ok(await api.htlc.lock.build(data, maker.secretKey));
});

test('HTLC: remaining byte inputs and cosigner signatures accept only hex strings', async t => {
    const claim = vectors.find(vector => vector.operation === 'claim');
    const refund = vectors.find(vector => vector.operation === 'refund');
    const prepareClaim = overrides => {
        const data = {...claim, ...overrides};
        return api.htlc.claim.preBuild(data.from, data.lockId, data.preimage, data.validity, data.networkId, {nonce: data.nonce});
    };
    const prepareRefund = overrides => {
        const data = {...refund, ...overrides};
        return api.htlc.refund.preBuild(data.from, data.lockId, data.validity, data.networkId, {nonce: data.nonce});
    };
    const cosigner = wallet(3);
    const lockData = await lock({signerSet: [maker.publicKeyHex, cosigner.publicKeyHex], threshold: 2});
    const cases = [
        ['metadata', '0080ff', value => lock({metadata: value})],
        ['nonce', single.terms.nonce, value => lock({nonce: value})],
        ['validity', single.validity, value => api.htlc.lock.preBuild(single.from, single.terms, value)],
        ['signerSet', maker.publicKeyHex, value => lock({signerSet: [value]})],
        ['cosigner signature', signHex(lockData.hash, cosigner), value => api.htlc.lock.build(lockData, maker.secretKey, [value])],
        ...['lockId', 'preimage', 'validity', 'nonce'].map(field => [field, claim[field], value => prepareClaim({[field]: value})]),
        ...['lockId', 'validity', 'nonce'].map(field => [field, refund[field], value => prepareRefund({[field]: value})]),
    ];

    for (const [field, hex, prepare] of cases) {
        t.ok(await prepare(hex.toUpperCase()), `${field} accepts hex strings`);
        for (const value of [b4a.from(hex, 'hex'), new Uint8Array(b4a.from(hex, 'hex')), 1, 1n, null, `0x${hex}`]) {
            await t.exception(() => prepare(value), new RegExp(`${field}.*hex string`));
        }
    }
});

test('HTLC: absent nonces generate new transactions for all operations', async t => {
    for (const prepare of [
        () => lock({nonce: undefined}),
        () => api.htlc.claim.preBuild(recipient.address, single.expected.hlo.tx, '33'.repeat(32), single.validity),
        () => api.htlc.refund.preBuild(recipient.address, single.expected.hlo.tx, single.validity),
    ]) {
        const first = await prepare();
        const second = await prepare();
        t.is(first.networkId, api.MAINNET_ID);
        t.absent(b4a.equals(first.nonce, second.nonce));
        t.absent(b4a.equals(first.hash, second.hash));
    }
});

test('HTLC lock: multisig can be prepared before signatures arrive', async t => {
    const cosigners = [wallet(3), wallet(4)].sort((a, b) => b4a.compare(a.publicKey, b.publicKey));
    const data = await lock({signerSet: [maker.publicKeyHex, ...cosigners.map(w => w.publicKeyHex)], threshold: 2});
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey), /Not enough signatures/);
    const signatures = cosigners.map(w => signHex(data.hash, w));
    const payload = decode(await api.htlc.lock.build(data, maker.secretKey, [signatures[1]]));
    t.alike(payload.hlo.cs, [signatures[1]], 'an optional earlier cosigner may be skipped');
    t.is(payload.hlo.tx, api.utils.toHexString(data.hash), 'adding signatures preserves lock ID');
    t.is(payload.hlo.th, '02');
    t.ok(await api.htlc.lock.build(data, maker.secretKey, signatures));
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, [...signatures].reverse()), /order/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, [signatures[0], signatures[0]]), /signature/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, [signHex(data.hash, maker)]), /signature/);
    await t.exception(() => api.htlc.lock.build(data, cosigners[0].secretKey, [signatures[1]]), /Secret key/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, [signHex(b4a.alloc(32, 1), cosigners[0])]), /signature/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, ['01'.repeat(63)]), /byte length/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, ['00'.repeat(64)]), /zero-filled/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, [...signatures, signatures[0]]), /outnumber/);
    await t.exception(() => api.htlc.lock.build(data, maker.secretKey, null), /outnumber/);
    const oneSignature = await lock({signerSet: data.signerSet, threshold: 1});
    await t.exception(() => api.htlc.lock.build(oneSignature, maker.secretKey, [signatures[0]]), /signature/, 'extra signatures must verify even when threshold is already met');
});

test('HTLC lock: maximum signer count and metadata are supported', async t => {
    const cosigners = Array.from({length: 7}, (_, i) => wallet(i + 3))
        .sort((a, b) => b4a.compare(a.publicKey, b.publicKey));
    const data = await lock({
        signerSet: [maker.publicKeyHex, ...cosigners.map(w => w.publicKeyHex)],
        threshold: 8, metadata: '00'.repeat(1024), feeAmount: '5', feeRecipient: recipient.address,
    });
    const signatures = cosigners.map(w => signHex(data.hash, w));
    const payload = decode(await api.htlc.lock.build(data, maker.secretKey, signatures));
    t.is(payload.hlo.ss.length, 8);
    t.is(payload.hlo.cs.length, 7);
    t.is(payload.hlo.md.length, 2048);
    t.is(payload.hlo.th, '08');
    t.is(payload.hlo.fa, '00000000000000000000000000000005');
    t.is(payload.hlo.fr, recipient.address);
    t.ok(api.signature.verify(b4a.from(payload.hlo.is, 'hex'), data.hash, maker.publicKey));
});

test('HTLC lock: invalid terms fail before signing', async t => {
    const cosigners = [wallet(3), wallet(4)].sort((a, b) => b4a.compare(a.publicKey, b.publicKey));
    for (const overrides of [
        {amount: '0'}, {amount: '-1'}, {amount: 'g'}, {amount: '1'.repeat(33)}, {amount: null},
        {amount: 'f'.repeat(32), feeAmount: '1', feeRecipient: recipient.address},
        {feeAmount: '1'}, {feeRecipient: recipient.address}, {feeRecipient: null},
        {claimAddress: 'invalid'}, {refundAddress: wallet(2, 'testtrac').address},
        {claimAddress: api.address.encode('trac', b4a.alloc(32))},
        {feeAmount: '1', feeRecipient: 'invalid'},
        {hashLock: '11'}, {hashLock: '00'.repeat(32)}, {hashLock: 'z'.repeat(64)},
        {refundEpoch: 0}, {refundEpoch: -1n}, {refundEpoch: 1n << 64n},
        {refundEpoch: Number.MAX_SAFE_INTEGER + 1}, {refundEpoch: 1.5}, {refundEpoch: '1'.repeat(17)},
        {metadata: ''}, {metadata: null}, {metadata: 'a'}, {metadata: 'gg'},
        {metadata: '00'.repeat(1025)},
        {nonce: null}, {nonce: '00'.repeat(32)}, {nonce: '11'},
        {signerSet: []}, {signerSet: null}, {signerSet: [recipient.publicKeyHex]},
        {signerSet: [maker.publicKeyHex, maker.publicKeyHex]}, {signerSet: [maker.publicKeyHex, '00'.repeat(32)]},
        {signerSet: [maker.publicKeyHex, ...cosigners.map(w => w.publicKeyHex).reverse()]},
        {signerSet: new Array(2)}, {signerSet: new Array(9).fill(maker.publicKeyHex)},
        {threshold: 0}, {threshold: 2}, {threshold: 1.5}, {threshold: '01'},
    ]) {
        await t.exception(() => lock(overrides), `rejects ${Object.keys(overrides).join(', ')}`);
    }
    for (const lockTerms of [null, [], 'lock']) {
        await t.exception(() => api.htlc.lock.preBuild(maker.address, lockTerms, single.validity), /lockTerms/);
    }
    for (const networkId of [0, -1, 1.5, 2 ** 32, '918', null]) {
        await t.exception(() => api.htlc.lock.preBuild(maker.address, single.terms, single.validity, networkId), /networkId/);
    }
    for (const validity of ['', '1'.repeat(63), '00'.repeat(32), null]) {
        await t.exception(() => api.htlc.lock.preBuild(maker.address, single.terms, validity), /validity/);
    }
    await t.exception(() => api.htlc.lock.preBuild('invalid', single.terms, single.validity), /from/);
});

test('HTLC lock: modified prepared terms and hashes cannot be finalized', async t => {
    const data = await lock({metadata: '00'});
    for (const overrides of [
        {amount: '2'}, {refundEpoch: '65'}, {validity: '44'.repeat(32)},
        {nonce: b4a.alloc(32, 3)}, {networkId: api.TESTNET_ID},
        {claimAddress: maker.address}, {refundAddress: recipient.address},
        {from: recipient.address, signerSet: [recipient.publicKeyHex]},
        {hashLock: '55'.repeat(32)}, {metadata: undefined}, {metadata: '0000'},
        {feeAmount: '1', feeRecipient: recipient.address},
        {signerSet: [maker.publicKeyHex, recipient.publicKeyHex]},
        {hash: b4a.alloc(32, 1)},
    ]) {
        await t.exception(() => api.htlc.lock.build({...data, ...overrides}, maker.secretKey), /does not match its hash/);
    }
    await t.exception(() => api.htlc.lock.build({...data, nonce: undefined}, maker.secretKey), /prepared/);
    await t.exception(() => api.htlc.lock.build({...data, networkId: undefined}, maker.secretKey), /prepared/);
    await t.exception(() => api.htlc.lock.build(null, maker.secretKey), /data/);
    await t.exception(() => api.htlc.lock.build(data, b4a.alloc(32, 1)), /secretKey/);
    const reconstructed = await api.htlc.lock.preBuild(data.from, {...data, nonce: api.utils.toHexString(data.nonce)}, data.validity, data.networkId);
    t.alike(reconstructed.hash, data.hash, 'another signer can independently reconstruct the hash with the same nonce');
});

test('HTLC build: snapshot inputs before asynchronous hashing', async t => {
    const data = await lock();
    const key = b4a.from(maker.secretKey);
    const pending = api.htlc.lock.build(data, key);
    data.nonce.fill(0);
    data.hash.fill(0);
    data.claimAddress = maker.address;
    data.signerSet[0] = api.utils.toHexString(recipient.publicKey);
    key.fill(0);
    t.alike(decode(await pending), single.expected);
});

test('HTLC claim/refund: validate inputs and reject changed drafts', async t => {
    const lockId = single.expected.hlo.tx;
    const preimage = '33'.repeat(32);
    const prepareClaim = (id = lockId, pi = preimage, options = {}) => api.htlc.claim.preBuild(recipient.address, id, pi, single.validity, api.MAINNET_ID, options);
    const prepareRefund = (id = lockId, options = {}) => api.htlc.refund.preBuild(recipient.address, id, single.validity, api.MAINNET_ID, options);
    for (const invalid of ['11', '00'.repeat(32), 'a'.repeat(63), 'zz'.repeat(32), null]) {
        await t.exception(() => prepareClaim(invalid));
        await t.exception(() => prepareRefund(invalid));
        await t.exception(() => prepareClaim(lockId, invalid));
    }
    await t.exception(() => prepareClaim(lockId, preimage, null), /options/);
    await t.exception(() => prepareRefund(lockId, null), /options/);
    await t.exception(() => prepareClaim(lockId, preimage, {nonce: '00'.repeat(32)}), /nonce/);
    await t.exception(() => prepareRefund(lockId, {nonce: 'ab'}), /nonce/);
    const claim = await prepareClaim();
    const refund = await prepareRefund();
    for (const [operation, data] of [['claim', claim], ['refund', refund]]) {
        for (const overrides of [
            {lockId: '55'.repeat(32)}, {validity: '66'.repeat(32)}, {networkId: api.TESTNET_ID},
            {nonce: b4a.alloc(32, 7)}, {hash: b4a.alloc(32, 8)},
        ]) {
            await t.exception(() => api.htlc[operation].build({...data, ...overrides}, recipient.secretKey), /does not match its hash/);
        }
        await t.exception(() => api.htlc[operation].build(data, maker.secretKey), /Secret key/);
    }
    await t.exception(() => api.htlc.claim.build({...claim, preimage: '44'.repeat(32)}, recipient.secretKey), /does not match its hash/);
});

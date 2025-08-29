
import test from 'brittle';
import api from '../../index.js';
import { TRAC_PUB_KEY_SIZE, TRAC_PRIV_KEY_SIZE } from '../../constants.js';
import b4a from 'b4a';

const hrp = 'trac';

test('address.generate: should generate a valid address and keypair with no mnemonic input', async (t) => {
    const result = await api.address.generate(hrp);
    t.is(typeof result.address, 'string');
    t.ok(b4a.isBuffer(result.publicKey));
    t.is(result.publicKey.length, TRAC_PUB_KEY_SIZE);
    t.ok(b4a.isBuffer(result.secretKey));
    t.is(result.secretKey.length, TRAC_PRIV_KEY_SIZE);
    t.is(typeof result.mnemonic, 'string');
});

test('address.generate: should generate the same keypair for the same mnemonic', async (t) => {
    const mnemonic = api.mnemonic.generate();
    const result1 = await api.address.generate(hrp, mnemonic);
    const result2 = await api.address.generate(hrp, mnemonic);
    t.ok(b4a.equals(result1.publicKey, result2.publicKey));
    t.ok(b4a.equals(result1.secretKey, result2.secretKey));
    t.is(result1.mnemonic, result2.mnemonic);
    t.is(result1.address, result2.address);
});


test('address.encode/decode: should encode and decode public key correctly', async (t) => {
    const { publicKey } = await api.address.generate(hrp);
    const encoded = api.address.encode(hrp, publicKey);
    const decoded = api.address.decode(encoded);
    t.ok(decoded.equals(publicKey));
});

test('address.encode: should throw on invalid public key', (t) => {
    try {
        api.address.encode(hrp, Buffer.alloc(10));
        t.fail();
    } catch {
        t.pass();
    }
});

test('address.decode: should throw on invalid address', (t) => {
    try {
        api.address.decode('invalidaddress');
        t.fail();
    } catch {
        t.pass();
    }
});

test('address.generate: should return an error for invalid mnemonic', async (t) => {
    try {
        const mnemonic = 'invalid mnemonic';
        const result = await api.address.generate(hrp, mnemonic);
        t.fail();
    }
    catch {
        t.pass(); // TODO: In the future, assert the error message
    }
});

test('address.generate: should return an error for missing hrp', async (t) => {
    try {
        const result = await api.address.generate(null);
        t.fail();
    } catch (error) {
        t.pass(); // TODO: In the future, assert the error message
    }
});

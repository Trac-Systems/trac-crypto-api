const api = window.TracCryptoApi;
const b4a = window.b4a;

test('utils is on window', () => {
    expect(api.utils).toBeDefined();
});

test('b4a is on window', () => {
    expect(b4a).toBeDefined();
});

test('memzero: should zero out a buffer', () => {
    const buf = b4a.from('hello world');

    api.utils.memzero(buf);

    expect([...buf].every((byte) => byte === 0)).toBe(true);
});

test('memzero: should not change a non-buffer object in the browser', () => {
    const nonBuffer = { a: 1, b: 'test' };
    const original = JSON.stringify(nonBuffer);

    api.utils.memzero(nonBuffer);

    expect(JSON.stringify(nonBuffer)).toBe(original);
});

test('toUInt32: should convert a number to a 4-byte big-endian buffer', () => {
    const num = 16909060; // 0x01020304
    const buf = api.utils.toUInt32(num, 0);

    expect(b4a.isBuffer(buf)).toBe(true);
    expect(buf.length).toBe(4);
    expect(b4a.equals(buf, b4a.from([1, 2, 3, 4]))).toBe(true);
});

test('isUInt32: should validate if a number is a valid uint32', () => {
    expect(api.utils.isUInt32(1)).toBe(true);
    expect(api.utils.isUInt32(4294967295)).toBe(true);
    expect(api.utils.isUInt32(0)).toBe(true);
    expect(api.utils.isUInt32(4294967296)).toBe(false);
    expect(api.utils.isUInt32(-1)).toBe(false);
    expect(api.utils.isUInt32(3.14)).toBe(false);
    expect(api.utils.isUInt32('string')).toBe(false);
});

test('isHexString: should validate if a string is a valid hex string', () => {
    expect(api.utils.isHexString('abcdef123456')).toBe(true);
    expect(api.utils.isHexString('ABCDEF123456')).toBe(true);
    expect(api.utils.isHexString('xyz123')).toBe(false);
    expect(api.utils.isHexString('12345g')).toBe(false);
    expect(api.utils.isHexString('')).toBe(false);
    expect(api.utils.isHexString(12345)).toBe(false);
});

test('serialize: should serialize buffers and uint32', () => {
    const buf1 = b4a.from([1, 2, 3]);
    const num = 16909060; // 0x01020304
    const buf2 = b4a.from([5, 6, 7, 8]);

    const serialized = api.utils.serialize(buf1, num, buf2);

    const normalized = b4a.from(serialized);

    expect(normalized.length).toBe(11);
    expect(b4a.equals(normalized, b4a.from([1, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8]))).toBe(true);
});

test('serialize: should throw error on invalid argument types', () => {
    const buf = b4a.from([1, 2, 3]);
    const invalidArgs = [
        'string', 
        {}, 
        null, 
        undefined, 
        3.14, 
        -1, 
        4294967296
    ];

    for (const arg of invalidArgs) {
        expect(() => api.utils.serialize(buf, arg)).toThrow();
    }
});

test('toBase64: should convert an object to a base64 string', () => {
    const obj = { 
        foo: 'bar', 
        num: 42, 
        hex: '1234567890abcdef' 
    };
    const base64 = api.utils.toBase64(obj);
    expect(typeof base64).toBe('string');

    const decoded = JSON.parse(b4a.toString(b4a.from(base64, 'base64'), 'utf-8'));
    expect(decoded.foo).toBe(obj.foo);
    expect(decoded.num).toBe(obj.num);
    expect(decoded.hex).toBe(obj.hex);
});

test('toBase64: should throw on invalid input', () => {
    const invalidInputs = [
        'string', 
        123, 
        null, 
        undefined
    ];

    for (const input of invalidInputs) {
        expect(() => api.utils.toBase64(input)).toThrow();
    }
});

test('buffer to hex string conversion', () => {
    const { toHexString } = api.utils;

    const sixteen = b4a.from([0, 0, 0, 0, 0, 0, 0, 0, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef]);
    const eight = b4a.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef]);

    expect(toHexString(sixteen)).toBe('00000000000000001234567890abcdef');
    expect(toHexString(eight)).toBe('1234567890abcdef');
});
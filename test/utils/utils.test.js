import test from 'brittle';
import api from '../../index.js';
import b4a from 'b4a';

test('memzero: should zero out a buffer', (t) => {
	const buf = b4a.from('hello world');
	api.utils.memzero(buf);
	t.ok(buf.every(byte => byte === 0));
});
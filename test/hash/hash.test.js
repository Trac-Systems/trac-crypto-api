
import test from 'brittle';
import hash from '../../modules/hash.js';
import b4a from 'b4a';

// TODO: Replace these with blake3 after implementation
test('hash.sha256: should compute SHA-256 hash of a string', (t) => {
  const message = 'hello world';
  const digest = hash.sha256(message);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 32);
});

test('hash.sha256: should compute SHA-256 hash of a Buffer', (t) => {
  const message = b4a.from('hello world');
  const digest = hash.sha256(message);
  t.ok(b4a.isBuffer(digest));
  t.is(digest.length, 32);
});

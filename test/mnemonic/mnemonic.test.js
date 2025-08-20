
import test from 'brittle';
import mnemonic from '../../modules/mnemonic.js';

test('mnemonic.generate: should generate a valid mnemonic', (t) => {
  const phrase = mnemonic.generate();
  t.is(typeof phrase, 'string');
  t.not(phrase, '');
  t.not(phrase.split(' ').length < 12, true);
});

test('mnemonic.sanitize: should sanitize and validate mnemonic', (t) => {
  const phrase = mnemonic.generate();
  const sanitized = mnemonic.sanitize(phrase);
  t.is(sanitized, phrase);
});

test('mnemonic.sanitize: should throw on invalid mnemonic', (t) => {
  try {
    mnemonic.sanitize('invalid mnemonic phrase');
    t.fail();
  } catch {
    t.pass();
  }
});

test('mnemonic.toSeed: should convert mnemonic to seed', async (t) => {
  const phrase = mnemonic.generate();
  const seed = await mnemonic.toSeed(phrase);
  t.ok(Buffer.isBuffer(seed));
  t.ok(seed.length > 0);
});

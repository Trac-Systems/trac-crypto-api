
import test from 'brittle';
import mnemonic from '../../modules/mnemonic.js';
import { MNEMONIC_WORD_COUNT } from '../../constants.js';


test('mnemonic.generate: should generate a valid mnemonic', (t) => {
  const phrase = mnemonic.generate();
  t.is(typeof phrase, 'string');
  t.not(phrase, '');
  t.is(phrase.split(' ').length, MNEMONIC_WORD_COUNT);
});

test('mnemonic.generate: should generate different mnemonics', (t) => {
  const phrase1 = mnemonic.generate();
  const phrase2 = mnemonic.generate();
  t.not(phrase1, phrase2);
});


test('mnemonic.sanitize: should sanitize and validate mnemonic', (t) => {
  const phrase = mnemonic.generate();
  const sanitized = mnemonic.sanitize(phrase);
  t.is(sanitized, phrase);
});

test('mnemonic.sanitize: should return null for invalid input', (t) => {
  t.is(mnemonic.sanitize(''), null);
  t.is(mnemonic.sanitize(undefined), null);
  t.is(mnemonic.sanitize({}), null);
  t.is(mnemonic.sanitize(1234), null);
  t.is(mnemonic.sanitize(null), null);
});

// Observation: This test was deactivated due to a limitation in the bip39 library,
// where we are not able to select the word count in the generated phrase.
// TODO: Reactivate once this problem is solved
// test('mnemonic.sanitize: should return null for wrong word count', (t) => {
//   const phrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'; // 12 words
//   t.is(mnemonic.sanitize(phrase), null);
// });


test('mnemonic.sanitize: should return null on invalid mnemonic', (t) => {
  t.is(mnemonic.sanitize('invalid mnemonic phrase'), null);
});


test('mnemonic.toSeed: should convert mnemonic to seed', async (t) => {
  const phrase = mnemonic.generate();
  const seed = await mnemonic.toSeed(phrase);
  t.ok(Buffer.isBuffer(seed));
  t.ok(seed.length > 0);
});

test('mnemonic.toSeed: should throw on invalid mnemonic', async (t) => {
  try {
    await mnemonic.toSeed('invalid mnemonic phrase');
    t.fail();
  } catch {
    t.pass();
  }
});

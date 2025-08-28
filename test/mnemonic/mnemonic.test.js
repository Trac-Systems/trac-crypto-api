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

test('mnemonic.validate: should return true for a valid mnemonic', (t) => {
  const phrase = mnemonic.generate();
  t.is(mnemonic.validate(phrase), true);
});

test('mnemonic.validate: should return false for an invalid mnemonic', (t) => {
  t.is(mnemonic.validate('invalid mnemonic phrase'), false);
});

test('mnemonic.validate: should return false for empty input', (t) => {
  t.is(mnemonic.validate(''), false);
  t.is(mnemonic.validate(null), false);
});

test('mnemonic.validate: should return false for wrong word count', (t) => {
  const phrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'; // 12 words
  t.is(mnemonic.validate(phrase), false);
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

test('mnemonic.sanitize: should return null for wrong word count', (t) => {
  const phrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'; // 12 words
  t.is(mnemonic.sanitize(phrase), null);
});


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

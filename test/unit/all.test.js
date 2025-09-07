import { default as test } from 'brittle';
import { TextEncoder, TextDecoder } from 'bare-encoding';

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

async function runTests() {
  test.pause();

  // await import('./mnemonic/mnemonic.test.js');
  // await import('./hash/hash.test.js');
  // await import('./address/address.test.js');
  // await import('./nonce/nonce.test.js');
  // await import('./signature/signature.test.js');
  // await import('./data/data.test.js');
  // await import('./utils/utils.test.js');
  await import('./key/derivation.test.js');

  test.resume();
}

await runTests();
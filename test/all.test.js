import { default as test } from 'brittle';

async function runTests() {
  test.pause();

  await import('./address/address.test.js');
  await import('./hash/hash.test.js');
  await import('./mnemonic/mnemonic.test.js');
  await import('./nonce/nonce.test.js');
  await import('./signature/signature.test.js');

  test.resume();
}

await runTests();
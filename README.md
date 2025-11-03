# trac-crypto-api

A stateless lightweight JavaScript cryptography toolkit for the TRAC Network. It provides primitives (Ed25519, BIP-39 mnemonics, bech32m addresses) and simple helpers for signing, address encoding/decoding, nonces, hashing, and transaction assembly.

---

## Installation

```bash
npm i trac-crypto-api
```

---

## Quick start

```js
import tracCrypto from 'trac-crypto-api';

// 1) Generate a keypair + address (using a new random mnemonic & default derivation path)
const {
  address,
  publicKey,
  secretKey,
  mnemonic,
  derivationPath,
} = await tracCrypto.address.generate('trac'); // HRP (prefix) is required

console.log('Address:', address); // A valid trac address
console.log('Mnemonic:', mnemonic); // Some random mnemonic
console.log('Derivation path:', derivationPath); // default derivation path: "m/918'/0'/0'/0'"

// 2) Derive another address from the same mnemonic but a different path
const alt = await tracCrypto.address.generate('trac', mnemonic, "m/918'/0'/0'/1'");
console.log('Same mnemonic?', alt.mnemonic === mnemonic); // true
console.log('Different address?', alt.address !== address); // true

// 3) Encode/decode
const encoded = tracCrypto.address.encode('trac', publicKey);
const decodedPubKey = tracCrypto.address.decode(encoded);

// 4) Sign & verify
const msg = Buffer.from('hello, trac');
const signature = tracCrypto.sign(msg, secretKey);
const ok = tracCrypto.signature.verify(signature, msg, publicKey);
console.log('Signature valid?', ok);

// 5) Nonce
const nonce = tracCrypto.nonce.generate();

// 6) Hashing
const digest = await tracCrypto.hash.blake3(Buffer.from('data'));

// 7) Transaction (example)
const fromAddr = address;
const toAddr = alt.address;

// validity: fetch from RPC in real apps; here we just generate a random 32-byte buffer
const validity = tracCrypto.nonce.generate().toString('hex');

// amount in hex string
const amount = '1234abcd';

// Pre-build gathers fields and generates a nonce internally
const txData = await tracCrypto.transaction.preBuild(fromAddr, toAddr, amount, validity);

// Build returns a base64 payload ready for the /broadcast-transaction RPC call
const txPayload = tracCrypto.transaction.build(txData, secretKey);
console.log('Signed tx (base64):', txPayload);
```
---

## Testing locally

```bash
# for Bare
npm run test:bare

# for Node.js
npm run test:node

# for browser
npm run test:browser
```

---

## Security notes

* Keep **mnemonics** and **secret keys** out of logs and source control.
* Consider **hardware-backed** key storage in production environments.
* Always validate user inputs before building/signing transactions.
* Fetch **current validity** from an authoritative RPC before broadcasting.

## FAQ

**Why bech32m?**
It’s a checksummed, human-readable encoding broadly used in crypto ecosystems. It reduces transcription errors and supports HRPs like `trac`.

**Where do I get “validity”?**
From your network’s RPC (block height/epoch/etc.). The helper accepts a 32-byte value so you can slot in the latest validity from your backend before `preBuild`.

---

### Minimal examples

**Create & verify a signature**

```js
import tracCrypto from 'trac-crypto-api';

const { publicKey, secretKey } = await tracCrypto.address.generate('trac');
const msg = Buffer.from('ping');
const sig = tracCrypto.sign(msg, secretKey);
console.log(tracCrypto.signature.verify(sig, msg, publicKey)); // true
```

**Encode & decode an address**

```js
const { publicKey } = await tracCrypto.address.generate('trac');
const addr = tracCrypto.address.encode('trac', publicKey);
const pub2 = tracCrypto.address.decode(addr);
console.log(Buffer.compare(Buffer.from(publicKey), Buffer.from(pub2)) === 0); // true
```

**Build a transaction payload**

```js
const { address: from, secretKey } = await tracCrypto.address.generate('trac');
const { address: to } = await tracCrypto.address.generate('trac');
const validity = require('crypto').randomBytes(32); // replace with RPC-fetched validity
const amountHex = '1234abcd';

const txData = await tracCrypto.transaction.preBuild(from, to, amountHex, validity);
const payload = tracCrypto.transaction.build(txData, secretKey);
// send payload to /broadcast-transaction
```
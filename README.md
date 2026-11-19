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

---

## HTLC transactions

`htlc.lock`, `htlc.claim`, and `htlc.refund` prepare and sign partial MSB operations.
Both `preBuild()` and `build()` are **asynchronous** for HTLC. `build()` recomputes
the hash before signing and rejects modified prepared data or a key that does not
match `from`. The existing `transaction` (TRANSFER) and `operation` (TX) APIs are unchanged.

```js
await tracCrypto.htlc.lock.preBuild(from, lockTerms, validity, networkId);
await tracCrypto.htlc.lock.build(lockData, secretKey, cosignerSignatures);
await tracCrypto.htlc.claim.preBuild(from, lockId, preimage, validity, networkId, options);
await tracCrypto.htlc.claim.build(claimData, secretKey);
await tracCrypto.htlc.refund.preBuild(from, lockId, validity, networkId, options);
await tracCrypto.htlc.refund.build(refundData, secretKey);
```

`networkId` defaults to `tracCrypto.MAINNET_ID`; use `tracCrypto.TESTNET_ID` for
testnet. All addresses within a lock must have the same prefix and a valid checksum.
`validity` is the current 32-byte value from `/v1/txv`, as a hex string.

### Lock terms

| Property | Input and meaning |
| --- | --- |
| `claimAddress` | Address receiving the principal on claim. Required. |
| `refundAddress` | Address receiving the principal plus surcharge on refund. Required. |
| `amount` | Positive amount in base units as a hex string, up to 16 bytes. Required. |
| `feeAmount` | Additional amount reserved in escrow as a hex string, up to 16 bytes. Defaults to `'0'`. Separate from the MSB network fee. |
| `feeRecipient` | Required exactly when `feeAmount` is non-zero; omit otherwise. |
| `hashLock` | 32-byte SHA-256 hash of the preimage as a 64-character hex string. Required. |
| `refundEpoch` | Positive MSB epoch as a hex string, up to 8 bytes. Required. |
| `metadata` | Optional opaque bytes as a hex string, decoded length 1–1024 bytes. Empty values and `null` are rejected; zero-filled nonempty bytes are allowed. |
| `signerSet` | Array of 1–8 public keys as 32-byte hex strings. Defaults to the locker public key alone. |
| `threshold` | Integer from 1 to `signerSet.length`, including the mandatory locker signature. Defaults to 1. |
| `nonce` | Optional non-zero 32-byte nonce as a hex string. Generated once by `preBuild()` when omitted. |

All byte inputs to HTLC `preBuild()` accept only hex strings without `0x`,
including `lockId`, `preimage`, and `validity`. Public keys in `signerSet` and
cosigner signatures passed to `lock.build()` are also hex strings.
Convert numeric values with `.toString(16)` and bytes with
`tracCrypto.utils.toHexString()` before passing them to these inputs.
Amounts and epochs may use shorter hex integers, including odd digit counts;
they are left-padded to their fixed widths. Other byte inputs require even-length
hex strings. Use base units for amounts
(1 TNK = 10^18 base units), not decimal TNK strings.

Prepared data contain `hash` and `nonce` as buffers, `networkId` and `threshold`
as numbers, and normalized byte fields as lowercase hex strings. Address fields
remain address strings. Pass prepared data directly to `build()` along with
`secretKey` as a buffer, as in the TX/TRANSFER API. In browser builds, buffers
use `Uint8Array`. The lock's `hash` is its **lock ID**.

```js
// maker and recipient are keypair/address objects. Fetch validity and currentEpoch from MSB.
const preimage = tracCrypto.nonce.generate(); // keep until claim
const lockData = await tracCrypto.htlc.lock.preBuild(maker.address, {
  claimAddress: recipient.address,
  refundAddress: maker.address,
  amount: (10n ** 18n).toString(16),
  hashLock: tracCrypto.utils.toHexString(tracCrypto.hash.sha256(preimage)),
  refundEpoch: (BigInt(currentEpoch) + 10n).toString(16),
}, validity);

const lockId = tracCrypto.utils.toHexString(lockData.hash);
const payload = await tracCrypto.htlc.lock.build(lockData, maker.secretKey);
// POST /v1/htlc with JSON body { payload }
```

### Multiple signatures

`signerSet[0]` must be the locker public key. The remaining keys must be unique
and sorted by raw bytes. The library rejects unsorted keys rather than changing
the signed terms. Every signer signs the same `lockData.hash` with Ed25519.
Signatures are independent; private keys can remain on separate devices.

```js
const lockData = await tracCrypto.htlc.lock.preBuild(maker.address, {
  claimAddress: recipient.address,
  refundAddress: maker.address,
  amount: '64',
  hashLock,    // 64-character hex string
  refundEpoch, // positive epoch as a hex string
  signerSet: [
    tracCrypto.utils.toHexString(maker.publicKey),
    tracCrypto.utils.toHexString(cosigner.publicKey),
  ],
  threshold: 2,
}, validity);

// Send a JSON-compatible proposal to the cosigner using your application's transport.
const { hash, nonce, ...lockTerms } = lockData;
const proposal = { ...lockTerms, nonce: tracCrypto.utils.toHexString(nonce) };

// On the cosigner's device: review the terms and independently reconstruct the hash.
const checked = await tracCrypto.htlc.lock.preBuild(
  proposal.from, proposal, proposal.validity, proposal.networkId
);
const cosignature = tracCrypto.utils.toHexString(
  tracCrypto.signature.sign(checked.hash, cosigner.secretKey)
);

// Return the signature to the locker and finalize the original prepared data.
const payload = await tracCrypto.htlc.lock.build(lockData, maker.secretKey, [cosignature]);
```

`preBuild()` does not require signatures. `build()` requires the locker signature
plus enough cosigner signatures to reach the threshold, and verifies every supplied
signature. Pass cosigner signatures as 64-byte hex strings in signer-set order. Optional cosigners may
be skipped without placeholders. A 2-of-3 lock always requires the locker plus
one cosigner; two cosigners cannot replace the locker.

Keep the nonce, validity, signer set, threshold, and all lock terms unchanged while
collecting signatures. Re-preparing with a new nonce or validity changes the lock ID
and requires new signatures. The application coordinates proposal review and signature exchange.

### Claim and refund

Any submitter can sign these operations. The recipients and amounts are already
fixed by the lock. Claim requires its non-zero 32-byte preimage and an epoch before
`refundEpoch`; refund is available at or after `refundEpoch` without a preimage.
Each operation needs a fresh validity reference; neither reuses the lock's nonce
or requires its original cosigner signatures.

```js
const preimageHex = tracCrypto.utils.toHexString(preimage);
const claimData = await tracCrypto.htlc.claim.preBuild(
  submitter.address, lockId, preimageHex, currentValidity
);
const claimPayload = await tracCrypto.htlc.claim.build(claimData, submitter.secretKey);
// POST /v1/htlc/:lockId/claim with { payload: claimPayload }

// Alternatively, once the refund epoch is reached and the escrow remains pending:
const refundData = await tracCrypto.htlc.refund.preBuild(
  submitter.address, lockId, currentValidity
);
const refundPayload = await tracCrypto.htlc.refund.build(refundData, submitter.secretKey);
// POST /v1/htlc/:lockId/refund with { payload: refundPayload }
```

The optional final `options` argument for claim/refund accepts `{ nonce }`, where
`nonce` is a 32-byte hex string, for reproducible preparation.
`build()` returns Base64-encoded JSON with `hlo` (type 17),
`hco` (18), or `hro` (19). HTTP `/v1/broadcast-transaction` is for TX/TRANSFER;
use the HTLC endpoints above and `GET /v1/htlc/:lockId` to read escrow state.

The library works offline and validates structure, hashes, signatures, and integer
ranges. MSB checks current validity, initialized epochs, balances, escrow confirmation
and settlement status. A new lock must expire at least one epoch after the current
epoch at admission and application. Choose an appropriate margin for submission.

Compatibility vectors in `test/fixtures/htlc.json` were generated from MSB `main`
commit `9008738f6acd5aa472c1b9aa5f2860b8826566d9`; Node, Bare, and browser tests compare
complete signed partial payloads against them.

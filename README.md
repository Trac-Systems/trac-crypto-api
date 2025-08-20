# trac-crypto-api

A lightweight cryptography API for TRAC Network

## Features

- **Ed25519 Key Generation**: Create key pairs from BIP39 mnemonics or random entropy.
- **Bech32m Address Encoding/Decoding**: Encode public keys as human-readable addresses and decode them back.
- **Mnemonic Utilities**: Generate, sanitize, and convert BIP39 mnemonics to seeds.
- **Secure Nonce Generation**: Create cryptographically secure nonces for transaction and message uniqueness.
- **Message Signing & Verification**: Sign messages and verify signatures using Ed25519.
- **Hashing**: SHA-256 hashing (Blake3 to be implemented soon).

## Usage

```js
import tracCrypto from 'trac-crypto-api';

// Generate a keypair and address from a mnemonic
const { address, publicKey, secretKey, mnemonic } = await tracCrypto.address.generate('trac', null);

// Encode a public key to address
const encoded = tracCrypto.address.encode('trac', publicKey);

// Decode an address to public key
const decodedPubKey = tracCrypto.address.decode(address);

// Sign a message
const signature = tracCrypto.sign(Buffer.from('message'), secretKey);

// Verify a signature
const isValid = tracCrypto.signature.verify(signature, Buffer.from('message'), publicKey);

// Generate a secure nonce
const nonce = tracCrypto.nonce.generate();
```
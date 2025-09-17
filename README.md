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

// Forge a transaction
const from = "trac1erl5alvuwq27ylssu20f2wwfh6xzr9pta6z5c4p6h9ram2uf4unstekq72"
const to = "trac1xwggfmeffw08n49qfk9w4hu9u32wnxu9mn04dvprk70mv3larpvsade4d5"
const validity = rundomeBuffer(32) // In a real case scenario, the current validity should be fetched through RPC call
const amount = "1234abcd" // Amount in hex format
const txData = await tracCrypto.transaction.preBuild(
    fromKeyPair.address,
    toKeyPair.address,
    amount,
    validity
);
const txPayload = tracCrypto.transaction.build(txData, yourSecretKey); // This function returns the signed payload to be sent via RPC
```
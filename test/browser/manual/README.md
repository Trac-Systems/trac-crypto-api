# TRAC Crypto API

A lightweight cryptographic toolkit for TRAC, supporting Node.js, Browser, and React Native environments.

---

## Installation

### Node.js / General

```bash
npm install trac-crypto-api
```

---

## Usage

### Node.js

```js
const trac = require("trac-crypto-api");

const { address } = trac;

(async () => {
  const wallet = await address.generate("trac");
  console.log(wallet.address);
})();
```

---

### Browser

#### Using CDN

```html
<script src="https://unpkg.com/trac-crypto-api/dist/trac-crypto-api.browser.js"></script>

<script>
  async function run() {
    const phrase = await window.TracCryptoApi.mnemonic.generate();
    console.log(phrase);
  }

  run();
</script>
```

#### Using a bundler (Vite, Webpack, Next.js, etc.)

Install the library:

```bash
npm install trac-crypto-api
```

Then import it:

```js
import TracCryptoApi from "trac-crypto-api";

const phrase = await TracCryptoApi.mnemonic.generate();
console.log(phrase);
```

---

### React Native

The library works out of the box in React Native environments.

Simply install it via:

```bash
yarn add trac-crypto-api
```

No additional setup is required in most modern React Native projects.

---

## Examples

### Generate Mnemonic

```js
const phrase = await TracCryptoApi.mnemonic.generate();
```

---

### Sanitize Mnemonic

```js
const phrase = await TracCryptoApi.mnemonic.generate();
const sabotaged = phrase.replaceAll(" ", "   ").toUpperCase();

const sanitized = await TracCryptoApi.mnemonic.sanitize(sabotaged);

console.log(sanitized);
```

---

## Notes

- `dist/trac-crypto-api.browser.js` → browser global build
- `dist/trac-crypto-api.browser.esm.js` → ES module build
- Source maps are optional and only useful for debugging
- Cryptographic operations rely on a sodium-compatible implementation internally.

---

## Environment Support

| Feature     | Node | Browser | React Native |
| ----------- | ---- | ------- | ------------ |
| address     | ✅   | ✅      | ✅           |
| mnemonic    | ✅   | ✅      | ✅           |
| hash        | ✅   | ✅      | ✅           |
| nonce       | ✅   | ✅      | ✅           |
| signature   | ✅   | ✅      | ✅           |
| utils       | ✅   | ✅      | ✅           |
| data        | ✅   | ✅      | ✅           |
| transaction | ✅   | ✅      | ✅           |
| operation   | ✅   | ✅      | ✅           |

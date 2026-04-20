# TRAC Crypto API – Browser Usage Guide

The **TRAC Crypto API** can be consumed directly in the browser using the pre-bundled distribution we ship under `dist/`.

## Installation

If you’re consuming this inside another project:

```bash
npm install trac-crypto-api
```

After installation, you’ll find the browser build under:

```bash
node_modules/trac-crypto-api/dist/
```

- trac-crypto-api.browser.js → Browser-ready bundle
- trac-crypto-api.browser.js.map → Source map (optional for debugging)

## Installation

# Global Variable (recommended)

The browser bundle also attaches itself to window.TracCryptoApi:

```bash
<script src="./node_modules/trac-crypto-api/dist/trac-crypto-api.browser.js"></script>
<script>
  async function testMnemonic() {
    const phrase = await window.TracCryptoApi.mnemonic.generate();
    console.log("Generated mnemonic:", phrase);
  }

  testMnemonic();
</script>
```

# Example: Sanitizing a Mnemonic

```bash
const phrase = await TracCryptoApi.mnemonic.generate();
const sabotaged = phrase.replaceAll(" ", "   ").toUpperCase();
const sanitized = await TracCryptoApi.mnemonic.sanitize(sabotaged);

console.log("Original:", phrase);
console.log("Sanitized:", sanitized);
```

## Notes

- trac-crypto-api.browser.js is the only file required to use the library in browsers.
- Use the \*.map file only if you want better debugging in dev tools.
- For modern browsers and frameworks, prefer the ES module import (<script type="module">).
- For quick tests or legacy pages, use the global window.TracCryptoApi.

function ensureDOMCompat() {
    if (typeof document === 'undefined') {
        globalThis.document = { currentScript: { src: '' } };
    }

    if (typeof location === 'undefined') {
        globalThis.location = { href: '' };
    }
}

module.exports = { ensureDOMCompat };
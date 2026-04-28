const test = require('brittle');

const { ensureDOMCompat } = require('../../../modules/compat/dom');

test('ensureDOMCompat: should define document and location if missing', (t) => {
    const originalDocument = globalThis.document;
    const originalLocation = globalThis.location;

    delete globalThis.document;
    delete globalThis.location;

    ensureDOMCompat();

    t.ok(globalThis.document, 'document should be defined');
    t.ok(globalThis.location, 'location should be defined');

    if (originalDocument === undefined) {
        delete globalThis.document;
    } else {
        globalThis.document = originalDocument;
    }

    if (originalLocation === undefined) {
        delete globalThis.location;
    } else {
        globalThis.location = originalLocation;
    }
});

test('ensureDOMCompat: should not override existing globals', (t) => {
    const originalDocument = globalThis.document;
    const originalLocation = globalThis.location;

    globalThis.document = { test: true };
    globalThis.location = { href: 'keep-me' };

    ensureDOMCompat();

    t.is(globalThis.document.test, true, 'existing document should be preserved');
    t.is(globalThis.location.href, 'keep-me', 'existing location should be preserved');

    if (originalDocument === undefined) {
        delete globalThis.document;
    } else {
        globalThis.document = originalDocument;
    }

    if (originalLocation === undefined) {
        delete globalThis.location;
    } else {
        globalThis.location = originalLocation;
    }
});

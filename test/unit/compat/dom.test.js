test('ensureDOMCompat: should define document and location if missing', () => {
    delete global.document;
    delete global.location;

    const { ensureDOMCompat } = require('../../../modules/compat/dom');
    ensureDOMCompat();

    expect(global.document).toBeDefined();
    expect(global.location).toBeDefined();
});
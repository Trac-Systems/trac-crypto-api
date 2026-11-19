const path = require('node:path');
const tracCrypto = require('../../index.js');

module.exports = {
    rpcUrl: 'http://79.210.205.178:5000',
    networkId: tracCrypto.TESTNET_ID,
    from: 'testtrac1u6rz9dx7n7jchmza7lzt8f48eygkqz242fawjn3ulag9erkdgutql46vfr',
    claimAddress: 'testtrac1deq4dxlerspq0kxgfuvlqkds3s769e4lw6xyeznhj4d4yk80k6nq2mr8l4',
    amountTnk: '1',
    epochs: '2',
    pollIntervalMs: 2000,
    waitTimeoutMs: 10 * 60 * 1000,
    requestTimeoutMs: 15000,
    stateDirectory: path.resolve(__dirname, '../../.local/htlc-testnet'),
};

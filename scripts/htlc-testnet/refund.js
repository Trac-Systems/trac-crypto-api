const tracCrypto = require('../../index.js');
const {loadState, readEscrow, confirmedLock, waitFor, submit, archiveTransaction, report, settled, runCli} = require('./common.js');

async function refund(context) {
    const {config, rpc, store, secretKey, log} = context;
    const state = await loadState(context);
    await rpc.health();
    const escrow = await confirmedLock(context, state);
    if (escrow.status !== 'PENDING') {
        await report(context, state, escrow);
        if (escrow.status !== 'REFUNDED') throw new Error('This lock has already been claimed.');
        return state;
    }

    // Both views must reach the deadline before MSB accepts a refund.
    const ready = await waitFor(context, `Waiting for refund epoch ${state.refundEpoch} in both views...`, async () => {
        const unsigned = await readEscrow(context, state, false);
        if (!unsigned) throw new Error('Lock is missing from current state. Retry when the RPC is synchronized.');
        if (unsigned.status !== 'PENDING') return unsigned.status;
        const epochs = await rpc.epochs();
        log(`Epochs: confirmed=${epochs.signed}, unconfirmed=${epochs.unsigned}; target=${state.refundEpoch}`);
        return epochs.signed >= BigInt(state.refundEpoch) && epochs.unsigned >= BigInt(state.refundEpoch) ? 'PENDING' : null;
    });
    if (ready !== 'PENDING') return settled(context, state, 'REFUNDED');

    if (!state.refund || context.options.refresh) {
        const data = await tracCrypto.htlc.refund.preBuild(config.from, state.lock.tx, await rpc.txv(), config.networkId);
        const payload = await tracCrypto.htlc.refund.build(data, secretKey);
        archiveTransaction(state, 'refund');
        state.refund = {tx: tracCrypto.utils.toHexString(data.hash), payload, attempts: 0};
        await store.save(state);
    }
    await submit(context, state, 'refund', `/v1/htlc/${state.lock.tx}/refund`);
    return settled(context, state, 'REFUNDED');
}

if (require.main === module) runCli('refund', refund);
module.exports = {refund};

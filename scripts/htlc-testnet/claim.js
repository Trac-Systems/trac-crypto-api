const tracCrypto = require('../../index.js');
const {loadState, readEscrow, confirmedLock, submit, archiveTransaction, report, settled, runCli} = require('./common.js');

async function claim(context) {
    const {config, rpc, store, secretKey} = context;
    const state = await loadState(context);
    await rpc.health();
    const escrow = await confirmedLock(context, state);
    if (escrow.status !== 'PENDING') {
        await report(context, state, escrow);
        if (escrow.status !== 'CLAIMED') throw new Error('This lock has already been refunded.');
        return state;
    }
    const unsigned = await readEscrow(context, state, false);
    if (!unsigned) throw new Error('Lock is missing from current state. Retry when the RPC is synchronized.');
    if (unsigned.status !== 'PENDING') return settled(context, state, 'CLAIMED');

    const epochs = await rpc.epochs();
    if (epochs.signed >= BigInt(state.refundEpoch) || epochs.unsigned >= BigInt(state.refundEpoch)) {
        throw new Error('Claim window has expired. Run refund.js with the same --case to recover the funds.');
    }
    if (!/^[a-f\d]{64}$/i.test(state.preimage) ||
        tracCrypto.utils.toHexString(tracCrypto.hash.sha256(Buffer.from(state.preimage, 'hex'))) !== state.hashLock) {
        throw new Error('Saved preimage does not match the lock hash.');
    }
    if (!state.claim || context.options.refresh) {
        const data = await tracCrypto.htlc.claim.preBuild(config.from, state.lock.tx, state.preimage, await rpc.txv(), config.networkId);
        const payload = await tracCrypto.htlc.claim.build(data, secretKey);
        archiveTransaction(state, 'claim');
        state.claim = {tx: tracCrypto.utils.toHexString(data.hash), payload, attempts: 0};
        await store.save(state);
    }
    await submit(context, state, 'claim', `/v1/htlc/${state.lock.tx}/claim`);
    return settled(context, state, 'CLAIMED');
}

if (require.main === module) runCli('claim', claim);
module.exports = {claim};

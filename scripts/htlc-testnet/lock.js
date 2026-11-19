const tracCrypto = require('../../index.js');
const {decimal} = require('./rpc.js');
const {parseAmount, formatAmount, loadState, readEscrow, confirmedLock, submit, balances, report, runCli} = require('./common.js');

async function lock(context) {
    const {config, options, rpc, store, secretKey, log} = context;
    let state = await loadState(context, false);
    await rpc.health();

    if (!state) {
        if (options.resend) throw new Error('There is no saved payload to resend.');
        const amount = parseAmount(options.amount ?? config.amountTnk);
        const duration = decimal(options.epochs ?? config.epochs, 'epochs');
        if (duration < 1n) throw new Error('The lock must last at least one epoch.');
        const [before, available, fee, epochs] = await Promise.all([
            balances(context), rpc.balance(config.from, false), rpc.fee(), rpc.epochs(),
        ]);
        if (available < amount + fee || BigInt(before.sender) < amount + fee) {
            throw new Error(`Insufficient balance: need ${formatAmount(amount + fee)} TNK including the lock fee.`);
        }
        const refundEpoch = (epochs.signed > epochs.unsigned ? epochs.signed : epochs.unsigned) + duration;
        const preimage = tracCrypto.nonce.generate();
        const hashLock = tracCrypto.utils.toHexString(tracCrypto.hash.sha256(preimage));
        const data = await tracCrypto.htlc.lock.preBuild(config.from, {
            claimAddress: config.claimAddress,
            refundAddress: config.from,
            amount: amount.toString(16),
            feeAmount: '0',
            hashLock,
            refundEpoch: refundEpoch.toString(16),
        }, await rpc.txv(), config.networkId);
        const payload = await tracCrypto.htlc.lock.build(data, secretKey);
        state = {
            version: 1, caseName: options.case, rpcUrl: config.rpcUrl, networkId: config.networkId,
            from: config.from, claimAddress: config.claimAddress, refundAddress: config.from,
            amount: amount.toString(), networkFee: fee.toString(), refundEpoch: refundEpoch.toString(),
            preimage: tracCrypto.utils.toHexString(preimage), hashLock, balancesBefore: before,
            lock: {tx: tracCrypto.utils.toHexString(data.hash), payload, attempts: 0}, status: 'PREPARED',
        };
        await store.save(state);
    } else if (options.amount !== undefined || options.epochs !== undefined) {
        throw new Error('This case already has a lock. Omit --amount/--epochs to resume; use a new --case for another lock.');
    }

    log(`Lock: ${formatAmount(state.amount)} TNK; refund epoch: ${state.refundEpoch}`);
    const signed = await readEscrow(context, state);
    if (signed) return report(context, state, signed);
    const unsigned = await readEscrow(context, state, false);
    if (!unsigned) {
        const epochs = await rpc.epochs();
        if (epochs.signed >= BigInt(state.refundEpoch) || epochs.unsigned >= BigInt(state.refundEpoch)) {
            throw new Error('Saved lock deadline has passed and no escrow is visible. No replacement was created. Check the saved lock ID before starting another case.');
        }
        await submit(context, state, 'lock', '/v1/htlc');
    }
    return report(context, state, await confirmedLock(context, state));
}

if (require.main === module) runCli('lock', lock);
module.exports = {lock};

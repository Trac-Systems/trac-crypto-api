const {setTimeout: delay} = require('node:timers/promises');
const {readFileSync} = require('node:fs');
const path = require('node:path');
const tracCrypto = require('../../index.js');
const defaults = require('./config.js');
const {createRpc, decimal} = require('./rpc.js');
const {createStore} = require('./state.js');

function parseAmount(value) {
    if (typeof value !== 'string' || !/^\d+(\.\d{1,18})?$/.test(value)) {
        throw new Error('Amount must be a positive TNK decimal with at most 18 fractional digits.');
    }
    const [whole, fraction = ''] = value.split('.');
    const amount = BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'));
    if (amount <= 0n || amount >= 1n << 128n) throw new Error('Amount is outside the uint128 range.');
    return amount;
}

function formatAmount(value) {
    const amount = BigInt(value);
    const sign = amount < 0n ? '-' : '';
    const digits = (amount < 0n ? -amount : amount).toString().padStart(19, '0');
    const fraction = digits.slice(-18).replace(/0+$/, '');
    return `${sign}${digits.slice(0, -18)}${fraction ? `.${fraction}` : ''}`;
}

function parseArguments(argv, operation) {
    const options = {};
    for (let i = 0; i < argv.length; i++) {
        const argument = argv[i];
        if (argument === '--help') options.help = true;
        else if (argument === '--resend') options.resend = true;
        else if (argument === '--refresh' && operation !== 'lock') options.refresh = true;
        else if (['--case', ...(operation === 'lock' ? ['--amount', '--epochs'] : [])].includes(argument)) {
            const value = argv[++i];
            if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}.`);
            options[argument.slice(2)] = value;
        } else throw new Error(`Unknown argument: ${argument}`);
    }
    if (!options.help && !options.case) throw new Error('Pass --case claim-test or --case refund-test.');
    if (options.resend && options.refresh) throw new Error('Use either --resend or --refresh.');
    return options;
}

function createContext(options, {config = defaults, env = process.env, fetchImpl = globalThis.fetch,
    log = console.log, signal, now = Date.now, sleep = ms => delay(ms, undefined, {signal})} = {}) {
    config = {...config, rpcUrl: (env.HTLC_RPC_URL || config.rpcUrl).replace(/\/$/, '')};
    if (config.networkId !== tracCrypto.TESTNET_ID) throw new Error('These scripts require TESTNET_ID.');
    for (const address of [config.from, config.claimAddress]) {
        if (!address.startsWith('testtrac1') || !tracCrypto.address.isValid(address) || !tracCrypto.address.canDecode(address)) {
            throw new Error('Both configured addresses must be valid testtrac addresses.');
        }
    }
    if (config.from === config.claimAddress) throw new Error('Use different sender and recipient addresses.');
    const url = new URL(config.rpcUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
        throw new Error('Invalid HTLC_RPC_URL.');
    }
    for (const field of ['pollIntervalMs', 'waitTimeoutMs', 'requestTimeoutMs']) {
        if (!Number.isSafeInteger(config[field]) || config[field] <= 0) throw new Error(`Invalid ${field}.`);
    }
    const secretKeyFile = path.join(config.stateDirectory, 'secret-key');
    let secretKeyHex = env.HTLC_SECRET_KEY;
    if (!secretKeyHex) {
        try {
            secretKeyHex = readFileSync(secretKeyFile, 'utf8').trim();
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
    }
    if (typeof secretKeyHex !== 'string' || !/^[a-f\d]{128}$/i.test(secretKeyHex)) {
        throw new Error(`Provide the 64-byte private key as hex (128 characters) in ${secretKeyFile} or HTLC_SECRET_KEY.`);
    }
    const secretKey = Buffer.from(secretKeyHex, 'hex');
    const challenge = Buffer.from('HTLC testnet script key check');
    if (!tracCrypto.signature.verify(tracCrypto.signature.sign(challenge, secretKey), challenge, tracCrypto.address.decode(config.from))) {
        throw new Error('Private key does not match the configured sender address.');
    }
    return {
        options, config, secretKey, log, signal, now, sleep,
        rpc: createRpc(config, fetchImpl, signal),
        store: createStore(config.stateDirectory, options.case),
    };
}

async function loadState(context, required = true) {
    const state = await context.store.read();
    if (!state) {
        if (required) throw new Error('No saved lock for this case. Run lock.js first.');
        return null;
    }
    if (state.version !== 1 || state.caseName !== context.options.case || state.rpcUrl !== context.config.rpcUrl ||
        state.networkId !== context.config.networkId || state.from !== context.config.from ||
        state.claimAddress !== context.config.claimAddress || state.refundAddress !== context.config.from) {
        throw new Error('Saved case does not match the configured RPC, network or addresses.');
    }
    return state;
}

async function waitFor(context, description, check) {
    const deadline = context.now() + context.config.waitTimeoutMs;
    context.log(description);
    do {
        context.signal?.throwIfAborted();
        const result = await check();
        if (result) return result;
        const remaining = deadline - context.now();
        if (remaining <= 0) break;
        await context.sleep(Math.min(context.config.pollIntervalMs, remaining));
    } while (context.now() <= deadline);
    throw new Error(`Timed out: ${description} Saved state: ${context.store.file}. Rerun the same command to resume.`);
}

function checkEscrow(state, escrow) {
    if (!escrow) return;
    if (escrow.lockerAddress !== state.from || escrow.claimRecipientAddress !== state.claimAddress ||
        escrow.refundRecipientAddress !== state.refundAddress || escrow.amount !== state.amount ||
        escrow.additionalFeeAmount !== '0' || escrow.hashLock !== state.hashLock || escrow.refundEpoch !== state.refundEpoch) {
        throw new Error('RPC escrow terms do not match the saved lock.');
    }
}

async function readEscrow(context, state, confirmed = true) {
    const escrow = await context.rpc.escrow(state.lock.tx, confirmed);
    checkEscrow(state, escrow);
    return escrow;
}

async function confirmedLock(context, state) {
    return waitFor(context, `Waiting for confirmed lock ${state.lock.tx}...`, () => readEscrow(context, state));
}

// A lost POST response never causes an automatic replacement transaction.
async function submit(context, state, operation, endpoint) {
    const transaction = state[operation];
    if (transaction.attempts > 0 && !context.options.resend) {
        context.log('A broadcast was already attempted. Checking confirmation without another POST.');
        return;
    }
    const body = JSON.parse(Buffer.from(transaction.payload, 'base64').toString('utf8'));
    const field = {lock: 'hlo', claim: 'hco', refund: 'hro'}[operation];
    if (body[field].txv !== await context.rpc.txv()) {
        throw new Error('Saved payload TXV is stale. It was not sent. See the recovery instructions; this script will not silently create a replacement.');
    }
    transaction.attempts++;
    // Persist before POST, including on the first attempt.
    await context.store.save(state);
    context.log(`Broadcasting ${operation}: ${transaction.tx}`);
    try {
        await context.rpc.broadcast(endpoint, transaction);
    } catch (error) {
        throw new Error(`${error.message}\nBroadcast outcome may be unknown. State is saved; rerun to check it, or use --resend to resend the same payload.`, {cause: error});
    }
}

function archiveTransaction(state, operation) {
    if (!state[operation]) return;
    state.previousTransactions ??= [];
    state.previousTransactions.push({operation, ...state[operation]});
}

async function balances(context) {
    const [sender, recipient] = await Promise.all([
        context.rpc.balance(context.config.from, true),
        context.rpc.balance(context.config.claimAddress, true),
    ]);
    return {sender: sender.toString(), recipient: recipient.toString()};
}

async function report(context, state, escrow) {
    state.status = escrow.status;
    const amount = decimal(state.amount, 'saved amount');
    const fee = decimal(state.networkFee, 'saved network fee');
    const expectedSender = BigInt(state.balancesBefore.sender) - fee - (escrow.status === 'REFUNDED' ? 0n : amount);
    const expectedRecipient = BigInt(state.balancesBefore.recipient) + (escrow.status === 'CLAIMED' ? amount : 0n);
    const actual = await balances(context);
    state.balanceCheck = {
        expected: {sender: expectedSender.toString(), recipient: expectedRecipient.toString()},
        actual,
        matches: actual.sender === expectedSender.toString() && actual.recipient === expectedRecipient.toString(),
    };
    await context.store.save(state);
    context.log(`Confirmed status: ${state.status}\nLock ID: ${state.lock.tx}\nState: ${context.store.file}`);
    for (const role of ['sender', 'recipient']) {
        context.log(`${role}: ${formatAmount(actual[role])} TNK; expected ${formatAmount(state.balanceCheck.expected[role])} TNK`);
    }
    context.log(state.balanceCheck.matches ? 'Balances match the scenario.' : 'Balances differ from the scenario. Check other account activity; confirmation above is the escrow status.');
    return state;
}

async function settled(context, state, expectedStatus) {
    const escrow = await waitFor(context, `Waiting for confirmed ${expectedStatus}...`, async () => {
        const current = await readEscrow(context, state);
        return current && current.status !== 'PENDING' ? current : null;
    });
    await report(context, state, escrow);
    if (escrow.status !== expectedStatus) throw new Error(`Expected ${expectedStatus}, but the lock is ${escrow.status}.`);
    return state;
}

async function runCli(operation, action) {
    const controller = new AbortController();
    const interrupt = () => controller.abort();
    process.once('SIGINT', interrupt);
    process.once('SIGTERM', interrupt);
    let context;
    try {
        const options = parseArguments(process.argv.slice(2), operation);
        if (options.help) {
            console.log(`node scripts/htlc-testnet/${operation}.js --case NAME${operation === 'lock' ? ' [--amount 1] [--epochs 2]' : ' [--refresh]'} [--resend]\nThe key is loaded from .local/htlc-testnet/secret-key or HTLC_SECRET_KEY (override). --resend sends the saved payload again; --refresh rebuilds a claim/refund only while the escrow remains pending.`);
            return;
        }
        context = createContext(options, {signal: controller.signal});
        await context.store.exclusive(() => action(context));
    } catch (error) {
        console.error(controller.signal.aborted ? 'Interrupted. Rerun the same command to resume from saved state.' : error.message);
        process.exitCode = controller.signal.aborted ? 130 : 1;
    } finally {
        context?.secretKey.fill(0);
        process.removeListener('SIGINT', interrupt);
        process.removeListener('SIGTERM', interrupt);
    }
}

module.exports = {parseAmount, formatAmount, parseArguments, createContext, loadState, waitFor,
    readEscrow, confirmedLock, submit, archiveTransaction, balances, report, settled, runCli};

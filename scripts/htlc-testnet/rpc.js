function decimal(value, label) {
    if (typeof value !== 'string' || !/^\d+$/.test(value)) {
        throw new Error(`Invalid ${label}: expected a decimal integer string.`);
    }
    return BigInt(value);
}

function createRpc(config, fetchImpl, signal) {
    async function request(path, payload) {
        const controller = new AbortController();
        const abort = () => controller.abort();
        signal?.addEventListener('abort', abort, {once: true});
        if (signal?.aborted) controller.abort();
        const timer = setTimeout(abort, config.requestTimeoutMs);
        try {
            const response = await fetchImpl(`${config.rpcUrl}${path}`, {
                method: payload === undefined ? 'GET' : 'POST',
                headers: payload === undefined ? undefined : {'Content-Type': 'application/json'},
                body: payload === undefined ? undefined : JSON.stringify({payload}),
                signal: controller.signal,
                redirect: 'error',
            });
            const body = await response.json();
            if (!response.ok) {
                const error = new Error(`RPC ${response.status} ${path}: ${body.error || 'Request failed'}`);
                error.status = response.status;
                throw error;
            }
            return body;
        } finally {
            clearTimeout(timer);
            signal?.removeEventListener('abort', abort);
        }
    }

    return {
        async health() {
            if ((await request('/v1/health')).ok !== true) throw new Error('MSB is not ready.');
        },
        async txv() {
            const {txv} = await request('/v1/txv');
            if (typeof txv !== 'string' || !/^[a-f\d]{64}$/i.test(txv)) throw new Error('Invalid RPC txv.');
            return txv.toLowerCase();
        },
        async fee() {
            return decimal((await request('/v1/fee')).fee, 'RPC fee');
        },
        async balance(address, confirmed = true) {
            const body = await request(`/v1/balance/${address}?confirmed=${confirmed}`);
            return decimal(body.balance, 'RPC balance');
        },
        async epochs() {
            const [signed, unsigned] = await Promise.all([
                request('/v1/current-epoch?confirmed=true'),
                request('/v1/current-epoch?confirmed=false'),
            ]);
            return {
                signed: decimal(signed.current_epoch, 'confirmed epoch (must be initialized)'),
                unsigned: decimal(unsigned.current_epoch, 'unconfirmed epoch (must be initialized)'),
            };
        },
        async escrow(lockId, confirmed = true) {
            try {
                const {htlc} = await request(`/v1/htlc/${lockId}?confirmed=${confirmed}`);
                if (!htlc || htlc.lockId !== lockId || !['PENDING', 'CLAIMED', 'REFUNDED'].includes(htlc.status)) {
                    throw new Error('Invalid RPC HTLC response.');
                }
                return htlc;
            } catch (error) {
                if (error.status === 404) return null;
                throw error;
            }
        },
        async broadcast(path, transaction) {
            const {result} = await request(path, transaction.payload);
            if (result?.tx !== transaction.tx) throw new Error('RPC returned a different transaction hash.');
            return result;
        },
    };
}

module.exports = {createRpc, decimal};

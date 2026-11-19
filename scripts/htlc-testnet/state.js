const fs = require('node:fs/promises');
const path = require('node:path');
const {randomUUID} = require('node:crypto');

function createStore(directory, caseName) {
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(caseName)) {
        throw new Error('Use --case with 1–64 lowercase letters, digits, underscores or hyphens.');
    }
    const file = path.join(directory, `${caseName}.json`);

    return {
        file,
        async read() {
            try {
                return JSON.parse(await fs.readFile(file, 'utf8'));
            } catch (error) {
                if (error.code === 'ENOENT') return null;
                throw error;
            }
        },
        async save(state) {
            await fs.mkdir(directory, {recursive: true, mode: 0o700});
            const temporary = `${file}.${randomUUID()}.tmp`;
            try {
                const handle = await fs.open(temporary, 'wx', 0o600);
                try {
                    await handle.writeFile(`${JSON.stringify(state, null, 2)}\n`);
                    await handle.sync();
                } finally {
                    await handle.close();
                }
                await fs.rename(temporary, file);
            } finally {
                await fs.rm(temporary, {force: true});
            }
        },
        async exclusive(action) {
            await fs.mkdir(directory, {recursive: true, mode: 0o700});
            const runningFile = `${file}.running`;
            let handle;
            try {
                handle = await fs.open(runningFile, 'wx', 0o600);
            } catch (error) {
                if (error.code === 'EEXIST') {
                    throw new Error(`Case already running: ${runningFile}. After a forced stop, remove this marker only when the previous process has exited.`, {cause: error});
                }
                throw error;
            }
            try {
                await handle.writeFile(String(process.pid));
                return await action();
            } finally {
                await handle.close();
                await fs.unlink(runningFile);
            }
        },
    };
}

module.exports = {createStore};

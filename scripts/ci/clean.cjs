const { rmSync } = require('node:fs');

const paths = [
    'node_modules',
    'dist',
    '.npm-cache',
    'test/browser/node_modules',
    'test/browser/.npm-cache'
];

for (const path of paths) {
    rmSync(path, { recursive: true, force: true });
}

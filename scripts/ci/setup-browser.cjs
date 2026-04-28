const { rmSync, readdirSync } = require("node:fs");
const { execSync } = require("node:child_process");
const path = require("node:path");

const browserDir = path.join(__dirname, "../../test/browser");

// clean
rmSync(path.join(browserDir, "node_modules/trac-crypto-api"), {
    recursive: true,
    force: true,
});

// remove old tgz
for (const file of readdirSync(browserDir)) {
    if (file.endsWith(".tgz")) {
        rmSync(path.join(browserDir, file), { force: true });
    }
}

// pack
execSync("npm pack --pack-destination test/browser", { stdio: "inherit" });

// find tgz
const tgz = readdirSync(browserDir).find((f) => f.endsWith(".tgz"));

if (!tgz) {
    throw new Error("No .tgz found");
}

// install
execSync(`npm install ./${tgz}`, {
    cwd: browserDir,
    stdio: "inherit",
});

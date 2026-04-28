import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";

export default {
    input: "index.js", // entrypoint
    output: [
        {
            file: "dist/trac-crypto-api.browser.js",
            format: "umd",
            name: "TracCryptoApi",
            sourcemap: true,
        },
        {
            file: "dist/trac-crypto-api.browser.esm.js",
            format: "es",
            sourcemap: true,
        },
    ],
    plugins: [
        json(),
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        commonjs(),
        replace({
            preventAssignment: true,
            values: {
                __filename: JSON.stringify(""),
                __dirname: JSON.stringify(""),
            },
        }),
    ],
    // evita puxar sodium-native
    onwarn(warning, warn) {
        if (warning.code === "THIS_IS_UNDEFINED") return;
        warn(warning);
    },
};

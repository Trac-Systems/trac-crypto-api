// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "entry.js"),
      name: "TracCryptoApi",
      fileName: "bundle",
    },
    target: "esnext",
  },
  resolve: {
    alias: {
      "sodium-universal": "sodium-javascript",
    },
  },
});

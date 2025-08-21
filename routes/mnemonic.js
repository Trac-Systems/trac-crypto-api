import express from "express";
import allModules from "../index.js";

const mnemonicRouter = express.Router();

// Endpoint to generate a new mnemonic phrase
mnemonicRouter.post("/generate", (req, res) => {
  try {
    const mnemonic = allModules.mnemonic.generate();
    res.status(200).json({ mnemonic });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate mnemonic." });
  }
});

// Endpoint to sanitize a mnemonic phrase
mnemonicRouter.post("/sanitize", (req, res) => {
  try {
    const { mnemonic } = req.body;
    const sanitized = allModules.mnemonic.sanitize(mnemonic);
    res.status(200).json({ mnemonic: sanitized });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to convert mnemonic to seed
mnemonicRouter.post("/to-seed", async (req, res) => {
  try {
    const { mnemonic, passphrase } = req.body;
    if (!mnemonic) {
      return res.status(400).json({ error: "Mnemonic is required." });
    }
    const seed = await allModules.mnemonic.toSeed(mnemonic, passphrase);
    res.status(200).json({ seed: seed.toString("hex") });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default mnemonicRouter;

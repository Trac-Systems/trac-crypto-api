// server.js

import express from "express";
import allModules from "./index.js"; // Import all your modules from the main entry point

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body from incoming requests
app.use(express.json());

// Main route for a simple health check
app.get("/", (req, res) => {
  res.status(200).send("API is running!");
});

// A new Router for the mnemonic module
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

// Use the mnemonic router for all /api/mnemonic routes
app.use("/api/mnemonic", mnemonicRouter);

// Start the server and capture the server instance in a variable
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export both the app and the server instance for testing purposes
export { app, server };

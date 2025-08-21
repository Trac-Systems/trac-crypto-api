import express from "express";
import allModules from "../index.js";

const addressRouter = express.Router();

// Endpoint to generate a new mnemonic phrase
addressRouter.post("/generate", async (req, res) => {
  try {
    const { hrp, mnemonic } = req.body;

    if (!hrp || typeof hrp !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'hrp' in request body." });
    }

    const address = await allModules.address.generate(hrp, mnemonic);
    res.status(200).json({ address });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to decode an address
addressRouter.post("/decode", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'address' in request body." });
    }

    const decode = await allModules.address.decode(address);
    res.status(200).json({ decode });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default addressRouter;

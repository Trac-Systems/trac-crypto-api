import express from "express";
import allModules from "../index.js";

const nonceRouter = express.Router();

// Endpoint to generate a new mnemonic phrase
nonceRouter.post("/generate", (req, res) => {
  try {
    const nonce = allModules.nonce.generate();
    res.status(200).json({ nonce });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate nonce." });
  }
});

export default nonceRouter;

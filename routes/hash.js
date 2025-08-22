import express from "express";
import b4a from "b4a"; // You need this to reconstruct the buffer
import allModules from "../index.js";

const hashRouter = express.Router();

// Endpoint to compute Blake3 hash
hashRouter.post("/blake3", async (req, res) => {
  const { message } = req.body;
  try {
    // Reconstruct the Buffer from the JSON object sent by the client
    const messageBuffer = b4a.from(message);

    const blake3Hash = await allModules.hash.blake3(messageBuffer);

    // Return the hash as a hexadecimal string
    res.status(200).json({ hash: blake3Hash.toString("hex") });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to compute Blake3Safe hash
hashRouter.post("/blake3Safe", async (req, res) => {
  const { message } = req.body;
  try {
    // Reconstruct the Buffer
    const messageBuffer = b4a.from(message);
    const blake3Hash = await allModules.hash.blake3Safe(messageBuffer);
    res.status(200).json({ hash: blake3Hash.toString("hex") });
  } catch (error) {
    res.status(400).json({ error: "Failed to compute blake3Safe hash." });
  }
});

// Endpoint to compute SHA256 hash
hashRouter.post("/sha256", (req, res) => {
  const { message } = req.body;
  try {
    // Reconstruct the Buffer
    const messageBuffer = b4a.from(message);
    const sha256Hash = allModules.hash.sha256(messageBuffer);
    res.status(200).json({ hash: sha256Hash.toString("hex") });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to compute SHA256Safe hash
hashRouter.post("/sha256Safe", (req, res) => {
  const { message } = req.body;
  try {
    // Reconstruct the Buffer
    const messageBuffer = b4a.from(message.data);
    const sha256Hash = allModules.hash.sha256Safe(messageBuffer);
    res.status(200).json({ hash: sha256Hash.toString("hex") });
  } catch (error) {
    res.status(400).json({ error: "Failed to compute sha256Safe hash." });
  }
});

export default hashRouter;

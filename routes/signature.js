import express from "express";
import b4a from "b4a";
import allModules from "../index.js";

const signatureRouter = express.Router();

// Helper function to convert various inputs to a Buffer
function getMessageBuffer(data) {
  if (data && typeof data === "object" && data.data) {
    return b4a.from(data.data);
  }
  throw new Error(
    "Invalid input: must be a Buffer or Uint8Array serialized to JSON"
  );
}

// Endpoint to sign a message
signatureRouter.post("/sign", async (req, res) => {
  const { message, privateKey } = req.body;

  try {
    const messageBuffer = getMessageBuffer(message);
    const privateKeyBuffer = getMessageBuffer(privateKey);

    const signature = await allModules.signature.sign(
      messageBuffer,
      privateKeyBuffer
    );

    res.status(200).json({ signature: signature.toString("hex") });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to verify a signature
signatureRouter.post("/verify", async (req, res) => {
  const { signature, message, publicKey } = req.body;

  try {
    const signatureBuffer = getMessageBuffer(signature);
    const messageBuffer = getMessageBuffer(message);
    const publicKeyBuffer = getMessageBuffer(publicKey);

    const isValid = await allModules.signature.verify(
      signatureBuffer,
      messageBuffer,
      publicKeyBuffer
    );

    res.status(200).json({ valid: isValid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default signatureRouter;

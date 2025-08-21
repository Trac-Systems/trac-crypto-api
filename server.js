import express from "express";
import mnemonicRouter from "./routes/mnemonic.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body from incoming requests
app.use(express.json());

// Main route for a simple health check
app.get("/", (req, res) => {
  res.status(200).send("API is running!");
});

// Use the mnemonic router for all /api/mnemonic routes
app.use("/api/mnemonic", mnemonicRouter);

// Start the server and capture the server instance in a variable
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export both the app and the server instance for testing purposes
export { app, server };

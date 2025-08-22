import request from "supertest";
import { app, server } from "../../server.js";
import b4a from "b4a";
import allModules from "../../index.js"; // Import your main module file

describe("Hash API Endpoints", () => {
  afterAll((done) => {
    server.close(done);
  });

  // Helper function to generate a random message
  function generateRandomMessage(length) {
    const buffer = b4a.alloc(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  }

  test("POST /api/hash/blake3 should return a valid Blake3 hash", async () => {
    const messageBuffer = generateRandomMessage(100);

    // Compute the expected hash using the real module function
    const expectedHash = await allModules.hash.blake3(messageBuffer);
    const expectedHashHex = expectedHash.toString("hex");

    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/blake3")
      .send({ message: messageBuffer });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("hash");

    // Assert that the hash from the API matches the hash from the module
    expect(response.body.hash).toBe(expectedHashHex);
    expect(response.body.hash.length).toBe(64);
  });

  test("POST /api/hash/blake3 should return an error for an invalid message", async () => {
    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/blake3")
      .send({ message: null });

    expect(response.statusCode).toBe(400);
    // Assert that the response body has a property named 'error'
    expect(response.body).toHaveProperty("error");

    // Assert that the error message is correct and informative
    expect(response.body.error).toBe(
      "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received null"
    );
  });

  test("POST /api/hash/blake3Safe should return a valid Blake3 hash", async () => {
    const messageBuffer = generateRandomMessage(100);

    // Compute the expected hash using the real module function
    const expectedHash = await allModules.hash.blake3Safe(messageBuffer);
    const expectedHashHex = expectedHash.toString("hex");

    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/blake3Safe")
      .send({ message: messageBuffer });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("hash");

    // Assert that the hash from the API matches the hash from the module
    expect(response.body.hash).toBe(expectedHashHex);
    expect(response.body.hash.length).toBe(64);
  });

  test("POST /api/hash/blake3Safe should return an error for an invalid message", async () => {
    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/blake3Safe")
      .send({ message: null });

    expect(response.statusCode).toBe(400);
    // Assert that the response body has a property named 'error'
    expect(response.body).toHaveProperty("error");

    // Assert that the error message is correct and informative
    expect(response.body.error).toBe("Failed to compute blake3Safe hash.");
  });

  test("POST /api/hash/sha256 should return a valid Blake3 hash", async () => {
    const messageBuffer = generateRandomMessage(100);

    // Compute the expected hash using the real module function
    const expectedHash = await allModules.hash.sha256(messageBuffer);
    const expectedHashHex = expectedHash.toString("hex");

    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/sha256")
      .send({ message: messageBuffer });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("hash");

    // Assert that the hash from the API matches the hash from the module
    expect(response.body.hash).toBe(expectedHashHex);
    expect(response.body.hash.length).toBe(64);
  });

  test("POST /api/hash/sha256 should return an error for an invalid message", async () => {
    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/sha256")
      .send({ message: null });

    expect(response.statusCode).toBe(400);
    // Assert that the response body has a property named 'error'
    expect(response.body).toHaveProperty("error");

    // Assert that the error message is correct and informative
    expect(response.body.error).toBe(
      "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received null"
    );
  });

  test("POST /api/hash/sha256Safe should return a valid Blake3 hash", async () => {
    const messageBuffer = generateRandomMessage(100);

    // Compute the expected hash using the real module function
    const expectedHash = await allModules.hash.sha256Safe(messageBuffer);
    const expectedHashHex = expectedHash.toString("hex");

    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/sha256Safe")
      .send({ message: messageBuffer });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("hash");

    // Assert that the hash from the API matches the hash from the module
    expect(response.body.hash).toBe(expectedHashHex);
    expect(response.body.hash.length).toBe(64);
  });

  test("POST /api/hash/sha256Safe should return an error for an invalid message", async () => {
    // Make the API call with the same message
    const response = await request(app)
      .post("/api/hash/sha256Safe")
      .send({ message: null });

    expect(response.statusCode).toBe(400);
    // Assert that the response body has a property named 'error'
    expect(response.body).toHaveProperty("error");

    // Assert that the error message is correct and informative
    expect(response.body.error).toBe("Failed to compute sha256Safe hash.");
  });
});

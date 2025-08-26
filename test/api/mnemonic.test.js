// test/api/mnemonic.test.js

import request from "supertest";
import { app, server } from "../../server.js"; // The Express app from your server.js file

describe("Mnemonic API Endpoints", () => {
  afterAll((done) => {
    server.close(done); // Close the server to allow the process to exit
  });

  // Test the GET / endpoint for a basic health check
  test('GET / should return "API is running!"', async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API is running!");
  });

  // Test the POST /api/mnemonic/generate endpoint
  test("POST /api/mnemonic/generate should return a new mnemonic", async () => {
    const response = await request(app).post("/api/mnemonic/generate");

    // Assert that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);

    // Assert that the response body has a 'mnemonic' property
    expect(response.body).toHaveProperty("mnemonic");

    // Assert that the mnemonic is a string with 12 words
    expect(typeof response.body.mnemonic).toBe("string");
    const words = response.body.mnemonic.split(" ");
    expect(words.length).toBe(24);
  });

  // Test the POST /api/mnemonic/sanitize endpoint with a valid mnemonic
  test("POST /api/mnemonic/sanitize should sanitize a valid mnemonic", async () => {
    const validMnemonic =
      "cigar capital anxiety valid very power coffee wagon faculty sing civil ski shadow can kind silly laptop correct gather arena knife fatigue naive furnace";
    const response = await request(app)
      .post("/api/mnemonic/sanitize")
      .send({ mnemonic: validMnemonic });

    expect(response.statusCode).toBe(200);
    expect(response.body.mnemonic).toBe(validMnemonic);
  });

  // Test the POST /api/mnemonic/sanitize endpoint with an invalid mnemonic
  test("POST /api/mnemonic/sanitize should return an error for an invalid mnemonic", async () => {
    const invalidMnemonic =
      "fury boil rebel dish velvet goat dish rebel goat dish velvet";
    const response = await request(app)
      .post("/api/mnemonic/sanitize")
      .send({ mnemonic: invalidMnemonic });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid mnemonic phrase");
  });

  // Test the POST /api/mnemonic/to-seed endpoint
  test("POST /api/mnemonic/to-seed should convert a mnemonic to a seed", async () => {
    const testMnemonic =
      "cigar capital anxiety valid very power coffee wagon faculty sing civil ski shadow can kind silly laptop correct gather arena knife fatigue naive furnace";
    const response = await request(app)
      .post("/api/mnemonic/to-seed")
      .send({ mnemonic: testMnemonic });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("seed");
    expect(typeof response.body.seed).toBe("string");
    expect(response.body.seed.length).toBe(128); // 64 hex characters = 32 bytes
  });
});

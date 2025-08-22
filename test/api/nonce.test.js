// test/api/mnemonic.test.js

import request from "supertest";
import { app, server } from "../../server.js"; // The Express app from your server.js file

describe("Nonce API Endpoints", () => {
  afterAll((done) => {
    server.close(done); // Close the server to allow the process to exit
  });

  // Test the POST /api/nonce/generate endpoint
  test("POST /api/nonce/generate should return a new 32-byte nonce", async () => {
    const expectedBytes = 32; // Nonce size in bytes

    const response = await request(app).post("/api/nonce/generate");

    // Assert that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);

    // Assert that the response body has a 'nonce' property
    expect(response.body).toHaveProperty("nonce");

    // Assert that the nonce is a string with 12 words
    expect(typeof response.body.nonce).toBe("object");
    const nonce = response.body.nonce;

    expect(nonce.data.length).toBe(expectedBytes);
  });

  // Test the POST /api/nonce/generate endpoint
  test("POST /api/nonce/generate should return a unique 32-byte nonce", async () => {
    const expectedBytes = 32; // Nonce size in bytes

    const responseNonce1 = await request(app).post("/api/nonce/generate");
    const responseNonce2 = await request(app).post("/api/nonce/generate");

    const nonce1 = responseNonce1.body.nonce;
    const nonce2 = responseNonce2.body.nonce;

    expect(nonce1).not.toBe(nonce2);
  });
});

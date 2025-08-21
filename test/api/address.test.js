// test/api/mnemonic.test.js

import request from "supertest";
import { app, server } from "../../server.js"; // The Express app from your server.js file

describe("Address API Endpoints", () => {
  afterAll((done) => {
    server.close(done); // Close the server to allow the process to exit
  });

  // Test the GET / endpoint for a basic health check
  test('GET / should return "API is running!"', async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API is running!");
  });

  // Test the POST /api/address/generate endpoint
  test("POST /api/address/generate should return a new address", async () => {
    const hrp = "trac"; // Example HRP
    const mnemonic = null; // No mnemonic provided, should generate a new one

    const response = await request(app)
      .post("/api/address/generate")
      .send({ hrp, mnemonic });

    // Assert that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);

    // Assert that the response body has a 'nonce' property
    expect(response.body).toHaveProperty("address");
    expect(typeof response.body.address).toBe("object");

    const { address } = response.body;

    expect(address).toHaveProperty("address");
    expect(address).toHaveProperty("mnemonic");
    expect(address).toHaveProperty("publicKey");
    expect(address).toHaveProperty("secretKey");

    // Assert that the data types are correct
    expect(typeof address.address).toBe("string");
    expect(typeof address.mnemonic).toBe("string");
    expect(typeof address.publicKey).toBe("object");
    expect(typeof address.secretKey).toBe("object");

    // Assert that the key lengths are correct
    expect(address.address.length).toBeGreaterThan(0);
    expect(address.mnemonic.split(" ").length).toBe(24); // Assuming a 24-word mnemonic
    expect(address.publicKey.data.length).toBe(32);
    expect(address.secretKey.data.length).toBe(64);
  });

  // Test the POST /api/address/generate endpoint with a generated mnemonic
  test("POST /api/address/generate with mnemonic should return a new address", async () => {
    const hrp = "trac"; // Example HRP
    const mnemonic = await request(app).post("/api/mnemonic/generate");
    generatedMnemonic = mnemonic.body.mnemonic;

    const response = await request(app)
      .post("/api/address/generate")
      .send({ hrp, mnemonic: generatedMnemonic }); // Pass the generated mnemonic

    // Assert that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);

    const { address } = response.body;

    // Assert that the response body has the correct properties
    expect(address).toHaveProperty("address");
    expect(address).toHaveProperty("publicKey");
    expect(address).toHaveProperty("secretKey");
    expect(address).toHaveProperty("mnemonic");

    // Assert that the returned mnemonic matches the one we provided
    expect(address.mnemonic).toBe(generatedMnemonic);
  });

  test("POST /api/address/generate should return an error for an invalid mnemonic", async () => {
    const hrp = "trac";
    const invalidMnemonic = "not a valid mnemonic phrase"; // A string that will fail validation

    const response = await request(app)
      .post("/api/address/generate")
      .send({ hrp, mnemonic: invalidMnemonic });

    // Assert that the status code is 400 (Bad Request)
    expect(response.statusCode).toBe(400);

    // Assert that the response body has a property named 'error'
    expect(response.body).toHaveProperty("error");

    // Assert that the error message is correct and informative
    expect(response.body.error).toBe("Invalid mnemonic phrase");
  });

  test("POST /api/address/decode should decode a valid address", async () => {
    // Generate a valid address to use in the decode test
    const hrp = "trac";
    const generateResponse = await request(app)
      .post("/api/address/generate")
      .send({ hrp });
    const { address: validAddress } = generateResponse.body.address;

    // Now, test the decode endpoint with the valid address
    const decodeResponse = await request(app)
      .post("/api/address/decode")
      .send({ address: validAddress });

    // Assertions for a successful decode
    expect(decodeResponse.statusCode).toBe(200);

    const { decode } = decodeResponse.body;
    expect(decode).toHaveProperty("type");
    expect(decode.type).toBe("Buffer");

    expect(decode).toHaveProperty("data");
    expect(typeof decode.data).toBe("object");
    expect(decode.data.length).toBe(32); // 32 bytes
  });

  test("POST /api/address/decode should return an error for an invalid address", async () => {
    const invalidAddress = "trac1q_this_is_not_valid";

    const response = await request(app)
      .post("/api/address/decode")
      .send({ address: invalidAddress });

    // Assertions for an unsuccessful decode
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

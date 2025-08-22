import request from "supertest";
import { app, server } from "../../server.js";
import b4a from "b4a";
import sodium from "sodium-universal";
import allModules from "../../index.js";

describe("Signature API Endpoints", () => {
  let keyPair;

  beforeAll(() => {
    // Generate a key pair for the tests using the core sodium library
    const pk = b4a.alloc(sodium.crypto_sign_PUBLICKEYBYTES);
    const sk = b4a.alloc(sodium.crypto_sign_SECRETKEYBYTES);
    sodium.crypto_sign_keypair(pk, sk);
    keyPair = { publicKey: pk, privateKey: sk };
  });

  afterAll((done) => {
    server.close(done);
  });

  function generateRandomMessage(length) {
    const buffer = b4a.alloc(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  }

  function serializeBuffer(buffer) {
    return { data: Array.from(buffer) };
  }

  //
  // Tests for POST /api/signature/sign
  //
  test("POST /api/signature/sign should return a valid signature", async () => {
    const message = generateRandomMessage(32);
    const privateKey = keyPair.privateKey;

    const response = await request(app)
      .post("/api/signature/sign")
      .send({
        message: serializeBuffer(message),
        privateKey: serializeBuffer(privateKey),
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("signature");
    expect(typeof response.body.signature).toBe("string");
    expect(response.body.signature.length).toBe(128);
  });

  test("POST /api/signature/sign should return an error for an invalid message", async () => {
    const privateKey = keyPair.privateKey;

    const response = await request(app)
      .post("/api/signature/sign")
      .send({
        message: null,
        privateKey: serializeBuffer(privateKey),
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Invalid input: must be a Buffer or Uint8Array serialized to JSON"
    );
  });

  test("POST /api/signature/sign should return an error for an invalid private key", async () => {
    const message = generateRandomMessage(32);

    const response = await request(app)
      .post("/api/signature/sign")
      .send({
        message: serializeBuffer(message),
        privateKey: null,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Invalid input: must be a Buffer or Uint8Array serialized to JSON"
    );
  });

  //
  // Tests for POST /api/signature/verify
  //
  test("POST /api/signature/verify should return true for a valid signature", async () => {
    const message = generateRandomMessage(32);
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    // First, sign the message to get a valid signature
    const signResponse = await request(app)
      .post("/api/signature/sign")
      .send({
        message: serializeBuffer(message),
        privateKey: serializeBuffer(privateKey),
      });
    const signature = b4a.from(signResponse.body.signature, "hex");

    // Then, verify the signature
    const verifyResponse = await request(app)
      .post("/api/signature/verify")
      .send({
        signature: serializeBuffer(signature),
        message: serializeBuffer(message),
        publicKey: serializeBuffer(publicKey),
      });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty("valid");
    expect(verifyResponse.body.valid).toBe(true);
  });

  test("POST /api/signature/verify should return false for an invalid signature", async () => {
    const message = generateRandomMessage(32);
    const publicKey = keyPair.publicKey;

    // Generate a random, invalid signature
    const invalidSignature = generateRandomMessage(64);

    const verifyResponse = await request(app)
      .post("/api/signature/verify")
      .send({
        signature: serializeBuffer(invalidSignature),
        message: serializeBuffer(message),
        publicKey: serializeBuffer(publicKey),
      });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty("valid");
    expect(verifyResponse.body.valid).toBe(false);
  });

  test("POST /api/signature/verify should return an error for invalid input types", async () => {
    const verifyResponse = await request(app)
      .post("/api/signature/verify")
      .send({
        signature: null,
        message: null,
        publicKey: null,
      });

    expect(verifyResponse.statusCode).toBe(400);
    expect(verifyResponse.body).toHaveProperty("error");
    expect(verifyResponse.body.error).toBe(
      "Invalid input: must be a Buffer or Uint8Array serialized to JSON"
    );
  });
});

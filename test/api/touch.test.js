// test/api/hash.test.js

import request from "supertest";
import { app, server } from "../../server.js"; // The Express app from your server.js file

describe("Hash API Endpoints", () => {
  afterAll((done) => {
    server.close(done); // Close the server to allow the process to exit
  });

  // Test the GET / endpoint for a basic health check
  test('GET / should return "API is running!"', async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API is running!");
  });
});

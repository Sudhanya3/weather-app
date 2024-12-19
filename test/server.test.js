import * as chai from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
import { describe, it } from "mocha";
import app from "../backend/server.js"; // Import the app instance

dotenv.config();

const { expect } = chai;
const request = supertest(app);

describe("Server API Tests", () => {
  describe("GET /api/getApiKey", () => {
    it("should return the API key if it exists", async () => {
      const res = await request.get("/api/getApiKey");
      expect(res.status).to.equal(200);
      expect(res.body)
        .to.have.property("apiKey")
        .that.equals(process.env.API_KEY);
    });

    it("should return an error if API key is missing", async () => {
      const originalApiKey = process.env.API_KEY;
      delete process.env.API_KEY;

      const res = await request.get("/api/getApiKey");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("error", "API key not found");

      process.env.API_KEY = originalApiKey;
    });
  });
});

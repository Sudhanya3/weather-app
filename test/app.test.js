import * as chai from "chai";
import chaiHttp from "chai-http";
import { JSDOM } from "jsdom";
import nock from "nock";
import fetch from "node-fetch";

const { expect } = chai;
global.fetch = fetch;

chai.use(chaiHttp);

describe("Weather App Testing", () => {
  afterEach(() => {
    // Clean up any nocks after each test
    nock.cleanAll();
  });

  it("should fetch the API from server successfully", async () => {
    // Use nock to mock the API response for the API key
    nock("http://localhost:3000")
      .get("/api/getApiKey")
      .reply(200, { apiKey: "test-api-key" });

    const response = await fetch("http://localhost:3000/api/getApiKey");
    const { apiKey } = await response.json();

    // Assertions
    expect(apiKey).to.equal("test-api-key");
  });

  it("should fetch weather data", async () => {
    const mockWeatherData = {
      name: "Miami",
      main: { temp: 298.65, humidity: 84 },
      weather: [{ description: "scattered clouds", id: 802 }],
    };

    const testCity = "Miami";
    const testApiKey = "test-api-key";

    // Mock API response for weather data using nock
    nock("https://api.openweathermap.org")
      .get(`/data/2.5/weather?q=${testCity}&appid=${testApiKey}`)
      .reply(200, mockWeatherData);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${testCity}&appid=${testApiKey}`
    );
    const data = await response.json();

    // Assertions
    expect(data.name).to.equal("Miami");
    expect(data.main.temp).to.equal(298.65);
    expect(data.weather[0].description).to.equal("scattered clouds");
  });

  it("should handle the failed weather data", async () => {
    // Mock API response for failed weather request using nock
    nock("https://api.openweathermap.org")
      .get("/data/2.5/weather?q=InvalidCity&appid=test-api-key")
      .reply(404);

    try {
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=InvalidCity&appid=test-api-key"
      );
      if (!response.ok) {
        throw new Error("Could not fetch weather data");
      }
    } catch (err) {
      expect(err.message).to.equal("Could not fetch weather data");
    }
  });

  it("should display an error when the city input is empty", () => {
    const { window } = new JSDOM("<!doctype html><html><body></body></html>");
    const { document } = window;
    global.document = document;

    const mockErrorMessage = "Please enter a city";
    const city = "";

    if (!city) {
      const errorDisplay = document.createElement("p");
      errorDisplay.textContent = mockErrorMessage;
      expect(errorDisplay.textContent).to.equal(mockErrorMessage);
    }
  });
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies

app.use(express.static("public"));

// API endpoint to fetch the API key
app.get("/api/getApiKey", (req, res) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not found" });
  }

  res.json({ apiKey });
});

// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;

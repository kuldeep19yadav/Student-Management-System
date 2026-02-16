require("dotenv").config();

const crypto = require("crypto");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const decryptMiddleware = require("./middleware/decryptMiddleware");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Generate RSA Key Pair
const fs = require("fs");

const publicKey = fs.readFileSync("./keys/public.pem", "utf8");
const privateKey = fs.readFileSync("./keys/private.pem", "utf8");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

// OAuth Token Endpoint
app.post("/token", (req, res) => {
  const { client_id, client_secret } = req.body;

  if (!client_id || !client_secret) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  if (client_id === CLIENT_ID && client_secret === CLIENT_SECRET) {
    const token = jwt.sign({ client: client_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ access_token: token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey });
});

// Protected Student Routes
app.use("/students", studentRoutes(privateKey, decryptMiddleware));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

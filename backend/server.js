
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "STREAMX Backend is running successfully!",
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`STREAMX Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup error:", error.message);
    process.exit(1);
  }
}

startServer();

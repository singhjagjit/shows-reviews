const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// routes
const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showreviews");
const userRoutes = require("./routes/user");

const app = express();

// CORS Middleware
app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;

// Connect to Mongo
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/shows", showRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;

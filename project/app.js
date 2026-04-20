require("dotenv").config();
const express = require("express");
const connectDB = require("./db/database");

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");

const app = express();

// DB (Singleton)
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS
app.set("view engine", "ejs");

// Routes
app.use("/auth", authRoutes);
app.use("/topics", topicRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("login");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
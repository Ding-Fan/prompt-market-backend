// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test"); // Import test routes
const authMiddleware = require("./middleware/authMiddleware");
const rateLimiter = require("./middleware/rateLimiter");

dotenv.config();

const app = express();

// Middleware
// Apply to all requests
app.use(rateLimiter);
app.use(
  cors({
    origin: "chrome-extension://cighcjmcfmlcpphgaagenelpndafjjac", // Replace with your extension's origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Connect to Database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Sync Models
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes); // Use test routes

// Example Protected Route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ msg: `Hello User ${req.user.id}` });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

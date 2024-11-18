// routes/test.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Unprotected Test GET Route
router.get("/hello", (req, res) => {
  res.json({ message: "Hello, this is an unprotected test route!" });
});

// Protected Test GET Route
router.get("/protected-hello", authMiddleware, (req, res) => {
  res.json({
    message: `Hello, User ${req.user.id}! This is a protected test route.`,
  });
});

module.exports = router;

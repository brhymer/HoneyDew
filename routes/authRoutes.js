const express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
  res.send("Login attempt");
});

router.get("/register", (req, res, next) => {});

module.exports = router;

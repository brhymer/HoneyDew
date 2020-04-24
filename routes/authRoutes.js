const express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

module.exports = router;

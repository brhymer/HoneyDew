const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.get("/", (req, res) => {
  res.render("spaces/index");
});

module.exports = router;

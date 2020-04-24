const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("spaces/index");
});

module.exports = router;

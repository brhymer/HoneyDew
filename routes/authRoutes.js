const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "Register" });
});

router.post("/register", async (req, res, next) => {
  try {
    //Try and find user
    const user = await ctrl.authCtrl.getUser({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user) {
      return res.render("auth/register", {
        title: "Register",
        error: "Username or email already exist",
      });
    }
    //Otherwise, salt and hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: hash,
    };

    //Create user
    await ctrl.authCtrl.createUser(userData);

    //redirect to login
    res.render("auth/login", { title: "Login" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

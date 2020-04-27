const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", async (req, res, next) => {
  try {
    //If user email not there, invalid credential
    const user = await ctrl.authCtrl.getUser({ username: req.body.username });
    if (!user) {
      res.render("auth/login", {
        title: "Login",
        errors: ["Invalid Credentials", "I just don't like you"],
      });
    }

    //use bcrypt compareSync to compare the req.body.pw with the user object pw
    //if they don't match, invalid credential
    const passwordsMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordsMatch) {
      res.render("auth/login", {
        title: "Login",
        errors: ["Invalid Credentials"],
      });
    }

    // create session
    req.session.currentUser = user._id;
    req.session.username = user.username;
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "Register" });
});

router.post(
  "/register",
  [check("email").isEmail(), check("password").isLength({ min: 8 })],
  async (req, res, next) => {
    try {
      //TODO Check that passwords match - form validation
      //https://express-validator.github.io/docs/

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("auth/register", {
          title: "Register",
          errors: ctrl.authCtrl.formatValidationErrorMessage(errors.array()),
        });
      }

      //Try and find user
      const user = await ctrl.authCtrl.getUser({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (user) {
        return res.render("auth/register", {
          title: "Register",
          errors: ["Username or email already exist"],
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
  }
);

module.exports = router;

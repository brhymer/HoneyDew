const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const bcrypt = require("bcryptjs");
const imageUpload = require("../middleware/multer");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");
const { check, validationResult } = require("express-validator");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", async (req, res, next) => {
  try {
    //If user email not there, invalid credential
    const user = await ctrl.authCtrl.getUser({ username: req.body.username });
    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        errors: ["Invalid Credentials"],
      });
    }
    //use bcrypt compareSync to compare the req.body.pw with the user object pw
    //if they don't match, invalid credential
    const passwordsMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordsMatch) {
      return res.render("auth/login", {
        title: "Login",
        errors: ["Invalid Credentials"],
      });
    }

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
  [check("email").isEmail(), check("password").isLength({ min: 12 })],
  async (req, res, next) => {
    try {
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
      const thisUser = await ctrl.authCtrl.createUser(userData);

      //Create default space
      const homeSpace = {
        name: "Home",
        description: "Default space",
        isRootSpace: true,
      };
      const thisSpace = await ctrl.spacesCtrl.createSpace(
        homeSpace,
        thisUser._id
      );
      //Only for the first space
      await ctrl.spacesCtrl.addSelfParent(thisSpace._id);
      //redirect to login
      res.render("auth/login", { title: "Login" });
    } catch (err) {
      next(err);
    }
  }
);

// User profile
router.get("/myprofile", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const userData = await ctrl.authCtrl.getUserWithSpaces(
      req.session.currentUser
    );
    res.render("auth/myprofile", {
      title: "My Profile",
      user: userData,
    });
  } catch (err) {
    next(err);
  }
});

// Edit user profile
router.get("/edit", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const userData = await ctrl.authCtrl.findUser(req.session.currentUser);
    res.render("auth/edit", {
      title: "Customize your Profile",
      user: userData,
    });
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.put(
  "/myprofile",
  imageUpload.multerUploads.single("imgFile"),
  async (req, res, next) => {
    if (!req.session.currentUser) return res.redirect("/auth/login");
    try {
      let imgObject;
      let currentUser;
      if (req.file) {
        [currentUser, imgObject] = await Promise.all([
          ctrl.authCtrl.findUser(req.session.currentUser),
          cloudinary.uploadToCloudinary(req.file.path),
        ]);
        if (currentUser.imgPublicId)
          await cloudinary.deleteFromCloudinary(currentUser.imgPublicId);
      } else imgObject = "";
      const updatedUser = await ctrl.authCtrl.updateUser(
        req.session.currentUser,
        req.body,
        imgObject
      );
      if (req.file) fs.unlinkSync(req.file.path);
      res.redirect("/auth/myprofile");
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/logout", async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

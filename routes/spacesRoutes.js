const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

// Index route
router.get("/", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisUser = await ctrl.authCtrl.getUserWithSpaces(
      req.session.currentUser
    );
    res.render("spaces/index", {
      title: "Your spaces",
      spaces: thisUser.spaces,
    });
  } catch (err) {
    next(err);
  }
});

// New route
router.get("/new", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    res.render("spaces/new", {
      title: "New space",
    });
  } catch (err) {
    next(err);
  }
});

// Create route
router.post("/", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const newSpace = await ctrl.spacesCtrl.createSpace(
      req.body,
      req.session.currentUser
    );
    res.redirect(`/spaces/${newSpace._id}`);
  } catch (err) {
    next(err);
  }
});

// Show route
router.get("/:id", async (req, res, next) => {
  try {
    if (!req.session.currentUser) return res.redirect("/auth/login");
    const thisSpace = await ctrl.spacesCtrl.getSpaceWithTasks(req.params.id);
    res.render("spaces/show", {
      title: thisSpace.name, // edit to make dynamic
      space: thisSpace,
      tasks: thisSpace.tasks,
    });
  } catch (err) {
    next(err);
  }
});

// Edit route
router.get("/:id/edit", async (req, res, next) => {
  try {
    if (!req.session.currentUser) return res.redirect("/auth/login");
    const foundSpace = await ctrl.spacesCtrl.getSpaceById(req.params.id);
    res.render("./spaces/edit", {
      title: "Edit this Space",
      space: foundSpace,
    });
  } catch (err) {
    next(err);
  }
});

// Update route
router.put("/:id", async (req, res, next) => {
  try {
    if (!req.session.currentUser) return res.redirect("/auth/login");
    const updatedSpace = await ctrl.spacesCtrl.updateSpaceById(
      req.params.id,
      req.body
    );
    res.redirect(`/spaces/${updatedSpace._id}`);
  } catch (err) {
    next(err);
  }
});

// Delete route
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedSpace = await ctrl.spacesCtrl.deleteSpaceById(
      req.params.id,
      req.session.currentUser
    );
    res.redirect("/spaces");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

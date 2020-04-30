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
router.get("/new/:spaceId?", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisUser = await ctrl.authCtrl.getUserWithSpaces(
      req.session.currentUser
    );
    res.render("spaces/new", {
      title: "New space",
      spaces: thisUser.spaces,
      targetSpace: req.query.spaceId ? req.query.spaceId : "",
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
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisSpace = await ctrl.spacesCtrl.getFullSpace(req.params.id);
    res.render("spaces/show", {
      title: thisSpace.name, // edit to make dynamic
      space: thisSpace,
      tasks: thisSpace.tasks,
      parentSpace: await ctrl.spacesCtrl.getSpaceById(thisSpace.parentSpace),
    });
  } catch (err) {
    next(err);
  }
});

// Edit route
router.get("/:id/edit", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const [thisSpace, allSpaces] = await Promise.all([
      ctrl.spacesCtrl.getSpaceById(req.params.id),
      ctrl.spacesCtrl.getSpaces({ userId: req.session.currentUser }),
    ]);
    res.render("./spaces/edit", {
      title: "Edit this Space",
      thisSpace: thisSpace,
      spaces: allSpaces,
    });
  } catch (err) {
    next(err);
  }
});

// Update route
router.put("/:id", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
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
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const deletedSpace = await ctrl.spacesCtrl.deleteSpaceById(
      req.params.id,
      req.session.currentUser
    );
    await ctrl.tasksCtrl.deleteTasksByParent(deletedSpace.tasks);
    await ctrl.authCtrl.removeTasks(
      req.session.currentUser,
      deletedSpace.tasks
    );
    res.redirect("/spaces");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

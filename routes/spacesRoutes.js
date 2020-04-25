const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

// router.get("/", (req, res) => {
//   res.render("spaces/index");
// });

// path is '/spaces'

// Index route
router.get("/", async (req, res) => {
  try {
    const allSpaces = await ctrl.spacesCtrl.getSpaces();
    res.render("spaces/index", {
      title: "Your spaces",
      spaces: allSpaces,
    });
  } catch (err) {
    return res.send(err);
  }
});

// New route
router.get("/new", async (req, res) => {
  // this route will need to access the db in the future
  try {
    res.render("spaces/new", {
      title: "New home",
    });
  } catch (err) {
    return res.send(err);
  }
});

// Create route
router.post("/", async (req, res) => {
  try {
    const newSpace = await ctrl.spacesCtrl.createSpace(req.body);
    res.redirect(`/spaces/${newSpace._id}`);
  } catch (err) {
    return res.send(err);
  }
});

// Show route
router.get("/:id", async (req, res) => {
  try {
    const getSpaceById = await ctrl.spacesCtrl.getSpaceById(req.params.id);
    res.render("spaces/show", {
      title: "Details on this space", // edit to make dynamic
      space: getSpaceById,
    });
  } catch (err) {
    return res.send(err);
  }
});

// Edit route
router.get("/:id/edit", async (req, res) => {
  try {
    const foundSpace = await ctrl.spacesCtrl.getSpaceById(req.params.id);
    res.render("./spaces/edit", {
      title: "Edit this Space",
      space: foundSpace,
    });
  } catch (err) {
    return res.send(err);
  }
});

// Update route
router.put("/:id", async (req, res) => {
  try {
    const updatedSpace = await ctrl.spacesCtrl.updateSpaceById(
      req.params.id,
      req.body
    );
    res.redirect(`/spaces/${updatedSpace._id}`);
  } catch (err) {
    return res.send(err);
  }
});

// Delete route
router.delete("/:id", async (req, res) => {
  try {
    const deletedSpace = await ctrl.spacesCtrl.deleteSpaceById(req.params.id);
    res.redirect("/spaces");
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;

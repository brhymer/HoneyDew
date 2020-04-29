const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");
const imageUpload = require("../middleware/multer");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");

//INDEX
router.get("/", async (req, res, next) => {
  res.redirect("/spaces");
});

//NEW
router.get("/new/:spaceId?", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const userSpaces = await ctrl.authCtrl.getUserWithSpaces(
      req.session.currentUser
    );
    let currentSpace = null;
    if (req.query.spaceId) {
      currentSpace = userSpaces.spaces.filter(
        (space) => space._id.toString() === req.query.spaceId.toString()
      )[0];
    }
    res.render("tasks/new", {
      title: "New Task",
      spaces: userSpaces.spaces,
      currentSpace: currentSpace,
    });
  } catch (err) {
    next(err);
  }
});

//CREATE
router.post(
  "/",
  imageUpload.multerUploads.single("imgFile"),
  async (req, res, next) => {
    if (!req.session.currentUser) return res.redirect("/auth/login");
    try {
      let imgObject;
      if (req.file) {
        imgObject = await cloudinary.uploadToCloudinary(req.file.path);
      } else imgObject = "";

      await ctrl.tasksCtrl.createTask(
        req.body,
        req.session.currentUser,
        imgObject
      );
      //This deletes our image from the server
      if (req.file) fs.unlinkSync(req.file.path);
      res.redirect(`/spaces/${req.body.spaceId}`);
    } catch (err) {
      next(err);
    }
  }
);

//SHOW
router.get("/:id", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisTask = await ctrl.tasksCtrl.getTaskById(req.params.id);
    if (req.session.currentUser.toString() !== thisTask.userId.toString()) {
      return res.render("tasks/index", {
        title: "Permission Error",
        tasks: await ctrl.tasksCtrl.getTasks({
          userId: req.session.currentUser,
        }),
        errors: ["You don't have permission to view that Task"],
      });
    }
    res.render("tasks/show", {
      task: thisTask,
    });
  } catch (err) {
    next(err);
  }
});

//EDIT
router.get("/edit/:id/", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisTask = await ctrl.tasksCtrl.getTaskById(req.params.id);
    const thisSpace = thisTask.spaceId ? thisTask.spaceId : "NA";
    const userSpaces = await ctrl.authCtrl.getUserWithSpaces(
      req.session.currentUser
    );
    res.render("tasks/edit", {
      title: "Edit Task",
      task: thisTask,
      spaces: userSpaces.spaces,
      thisSpace: thisSpace,
    });
  } catch (err) {
    next(err);
  }
});

//PUT
router.put(
  "/:id",
  imageUpload.multerUploads.single("imgFile"),
  async (req, res, next) => {
    if (!req.session.currentUser) return res.redirect("/auth/login");
    try {
      let imgObject;
      let currentTask;
      if (req.file) {
        [currentTask, imgObject] = await Promise.all([
          ctrl.tasksCtrl.getTaskById(req.params.id),
          cloudinary.uploadToCloudinary(req.file.path),
        ]);
        //If you already have an image, delete it
        if (currentTask.imgPublicId)
          await cloudinary.deleteFromCloudinary(currentTask.imgPublicId);
      } else imgObject = "";
      const updatedTask = await ctrl.tasksCtrl.updateTaskById(
        req.params.id,
        req.body,
        imgObject
      );
      if (req.file) fs.unlinkSync(req.file.path);
      res.redirect(`/spaces/${updatedTask.spaceId}`);
    } catch (err) {
      next(err);
    }
  }
);

//COMPLTE TASK
router.put("/complete/:id/:status", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    let thisTask;
    if (req.params.status === "false") {
      thisTask = await ctrl.tasksCtrl.completeTask(req.params.id);
    } else {
      thisTask = await ctrl.tasksCtrl.uncompleteTask(req.params.id);
    }
    res.redirect(`/spaces/${thisTask.spaceId}`);
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete("/:id", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const deletedTask = await ctrl.tasksCtrl.deleteTaskById(
      req.params.id,
      req.session.currentUser
    );
    if (deletedTask.imgUrl)
      await cloudinary.deleteFromCloudinary(deletedTask.imgPublicId);
    res.redirect(`/spaces/${deletedTask.spaceId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

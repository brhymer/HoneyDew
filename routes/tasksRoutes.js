const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

//INDEX
router.get("/", async (req, res, next) => {
  try {
    res.render("tasks/index", {
      title: "Tasks",
      tasks: await ctrl.tasksCtrl.getTasks(),
    });
  } catch (err) {
    next(err);
  }
});

//NEW
router.get("/new", (req, res, next) => {
  res.render("tasks/new");
});

//CREATE
router.post("/", async (req, res, next) => {
  try {
    await ctrl.tasksCtrl.createTask(req.body);
    res.redirect("/tasks");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

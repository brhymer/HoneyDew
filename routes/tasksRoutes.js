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
  res.render("tasks/new", {
    title: "New Task",
  });
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

//SHOW
router.get("/:id", async (req, res, next) => {
  try {
    const thisTask = await ctrl.tasksCtrl.getTaskById(req.params.id);
    res.render("tasks/show", {
      task: thisTask,
    });
  } catch (err) {
    next(err);
  }
});

//EDIT
router.get("/edit/:id", async (req, res, next) => {
  try {
    const thisTask = await ctrl.tasksCtrl.getTaskById(req.params.id);
    res.render("tasks/edit", {
      title: "Edit Task",
      task: thisTask,
    });
  } catch (err) {
    next(err);
  }
});

//PUT
router.put("/:id", async (req, res, next) => {
  try {
    const updatedTask = await ctrl.tasksCtrl.updateTaskById(
      req.params.id,
      req.body
    );
    res.render("tasks/show", {
      task: updatedTask,
    });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    await ctrl.tasksCtrl.deleteTaskById(req.params.id);
    res.redirect("/tasks");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

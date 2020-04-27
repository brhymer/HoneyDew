const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

//INDEX
router.get("/", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisUser = await ctrl.authCtrl.getUserWithTasks(
      req.session.currentUser
    );
    res.render("tasks/index", {
      title: "Tasks",
      tasks: thisUser.tasks,
    });
  } catch (err) {
    next(err);
  }
});

//NEW
router.get("/new", (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  res.render("tasks/new", {
    title: "New Task",
  });
});

//CREATE
router.post("/", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    await ctrl.tasksCtrl.createTask(req.body, req.session.currentUser);
    res.redirect("/tasks");
  } catch (err) {
    next(err);
  }
});

//SHOW
router.get("/:id", async (req, res, next) => {
  //If you're not logged in, you don't get to see
  if (!req.session.currentUser) return res.redirect("/auth/login");
  try {
    const thisTask = await ctrl.tasksCtrl.getTaskById(req.params.id);
    if (req.session.currentUser.toString() !== thisTask.userId.toString()) {
      return res.render("tasks/index", {
        title: "You can't",
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
router.get("/edit/:id", async (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("/auth/login");
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
  if (!req.session.currentUser) return res.redirect("/auth/login");
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
    await ctrl.tasksCtrl.deleteTaskById(req.params.id, req.session.currentUser);
    res.redirect("/tasks");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

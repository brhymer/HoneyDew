const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.put("/tasks/complete/:id/:status", async (req, res, next) => {
  if (!req.session.currentUser) res.send("401");
  try {
    let thisTask;
    if (req.params.status === "false") {
      thisTask = await ctrl.tasksCtrl.completeTask(req.params.id);
    } else {
      thisTask = await ctrl.tasksCtrl.uncompleteTask(req.params.id);
    }
    // res.json({
    //   message: "Done",
    //   id: req.params.id,
    //   status: req.params.status,
    // });
    console.log(thisTask);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

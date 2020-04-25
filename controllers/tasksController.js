const db = require("../models");

async function createTask(taskInformation, userId) {
  taskInformation.userId = userId;
  return await db.Task.create(taskInformation);
}

async function getTasks(searchParameters) {
  const tasks = await db.Task.find(searchParameters);
  tasks.map((task) => (task.dueDate = adjustDateForTimeZone(task.dueDate)));

  return tasks;
}

async function getTaskById(id) {
  const thisTask = await db.Task.findById(id);
  thisTask.dueDate = adjustDateForTimeZone(thisTask.dueDate);
  return thisTask;
}

async function getTaskOwner(id) {
  const thisTask = await db.Task.findById(id)
    .populate({ path: "userId" })
    .exec();
  return thisTask.userId;
}

async function updateTaskById(id, modifiedTask) {
  return await db.Task.findByIdAndUpdate(id, modifiedTask, { new: true });
}

async function deleteTaskById(id) {
  return await db.Task.findByIdAndDelete(id);
}

function adjustDateForTimeZone(dateObject) {
  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  //Allows us to move our dates to HTML while adapting for timezones correctly
  const tempDate = new Date(dateObject);
  const offset = tempDate.getTimezoneOffset();
  return new Date(tempDate.getTime() + offset * 60000);
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getTaskOwner,
  updateTaskById,
  deleteTaskById,
};

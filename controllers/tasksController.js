const db = require("../models");

async function createTask(taskInformation, userId, imageObject) {
  taskInformation.userId = userId;
  taskInformation.dueDate = adjustDateForTimeZone(taskInformation.dueDate);
  taskInformation.imgUrl = imageObject.url;
  taskInformation.imgPublicId = imageObject.public_id;
  if (taskInformation.spaceId === "") taskInformation.spaceId = null;
  const [newTask, thisUser, thisSpace] = await Promise.all([
    db.Task.create(taskInformation),
    db.User.findById(userId),
    db.Space.findById(taskInformation.spaceId),
  ]);
  thisUser.tasks.push(newTask);
  await thisUser.save();
  if (thisSpace) {
    thisSpace.tasks.push(newTask);
    await thisSpace.save();
  }
  return newTask;
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

async function updateTaskById(taskId, modifiedTask, imageObject) {
  if (modifiedTask.spaceId === "") modifiedTask.spaceId = null;
  if (modifiedTask.dueDate)
    modifiedTask.dueDate = adjustDateForTimeZone(modifiedTask.dueDate);
  modifiedTask.imgUrl = imageObject.url;
  modifiedTask.imgPublicId = imageObject.public_id;
  const [updatedTask, startingSpace] = await Promise.all([
    db.Task.findByIdAndUpdate(taskId, modifiedTask, { new: true }),
    db.Space.findOne({ tasks: taskId })
      .populate({ path: "tasks", match: { _id: taskId } })
      .exec(),
  ]);

  //Combinations of spaces
  if (startingSpace && !modifiedTask.spaceId) {
    console.log(startingSpace);
    startingSpace.tasks.remove(taskId);
    await startingSpace.save();
  }

  if (!startingSpace && modifiedTask.spaceId) {
    const newSpace = await db.Space.findById(modifiedTask.spaceId);
    newSpace.tasks.push(taskId);
    await newSpace.save();
  }

  if (startingSpace && modifiedTask.spaceId) {
    if (startingSpace._id.toString() !== modifiedTask.spaceId.toString()) {
      startingSpace.tasks.remove(taskId);
      await startingSpace.save();
      const newSpace = await db.Space.findById(modifiedTask.spaceId);
      newSpace.tasks.push(taskId);
      await newSpace.save();
    }
  }

  return updatedTask;
}

async function completeTask(taskId) {
  return await db.Task.findByIdAndUpdate(taskId, { complete: true });
}

async function uncompleteTask(taskId) {
  return await db.Task.findByIdAndUpdate(taskId, { complete: false });
}

async function deleteTaskById(taskId, userId) {
  const [deletedTask, thisUser] = await Promise.all([
    db.Task.findByIdAndDelete(taskId),
    db.User.findById(userId),
  ]);
  const thisSpace = await db.Space.findById(deletedTask.spaceId);
  if (thisSpace) {
    thisSpace.tasks.remove(taskId);
    await thisSpace.save();
  }
  thisUser.tasks.remove(taskId);
  await thisUser.save();
  return deletedTask;
}

async function deleteTasksByParent(parentTasks) {
  await db.Task.deleteMany({ _id: { $in: parentTasks } });
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
  completeTask,
  uncompleteTask,
  deleteTaskById,
  deleteTasksByParent,
};

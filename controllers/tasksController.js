const db = require("../models");

async function createTask(taskInformation) {
  return await db.Task.create(taskInformation);
}

async function getTasks(searchParameters) {
  return await db.Task.find(searchParameters);
}

module.exports = { createTask, getTasks };

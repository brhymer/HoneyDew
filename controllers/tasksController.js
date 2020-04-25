const db = require("../models");

async function createTask(taskInformation) {
  return await db.Task.create(taskInformation);
}

async function getTasks(searchParameters) {
  return await db.Task.find(searchParameters);
}

async function getTaskById(id) {
  return await db.Task.findById(id);
}

module.exports = { createTask, getTasks, getTaskById };

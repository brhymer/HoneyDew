const db = require("../models");

async function getUser(searchParameters) {
  return await db.User.findOne(searchParameters);
}

async function findUser(id) {
  return await db.User.findById(id);
}

async function getUserWithTasks(id) {
  return await db.User.findById(id).populate({ path: "tasks" }).exec();
}

async function getUserWithSpaces(id) {
  return await db.User.findById(id).populate({ path: "spaces" }).exec();
}

async function createUser(userData) {
  return await db.User.create(userData);
}

async function updateUser(id, reqBody) {
  const updatedUser = { ...reqBody };
  return await db.User.findByIdAndUpdate(id, updatedUser, { new: true });
}

async function updateSpaceById(id, reqBody) {
  const updatedSpace = { ...reqBody };
  return await db.Space.findByIdAndUpdate(id, updatedSpace, { new: true });
}

// async function getAllUsers() {
//   // This is for grabbing all users.
//   return await db.User.find();
// }

function formatValidationErrorMessage(errors) {
  const formattedErrors = [];
  errors.forEach((error) => {
    let cleanError = `${
      error.param.charAt(0).toUpperCase() + error.param.slice(1)
    }: ${error.msg}`;
    formattedErrors.push(cleanError);
  });
  return formattedErrors;
}

module.exports = {
  getUser,
  findUser,
  getUserWithTasks,
  getUserWithSpaces,
  createUser,
  updateUser,
  // getAllUsers,
  formatValidationErrorMessage,
};

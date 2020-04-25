const db = require("../models");

async function getUser(searchParameters) {
  return await db.User.findOne(searchParameters);
}

async function createUser(userData) {
  return await db.User.create(userData);
}

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

module.exports = { getUser, createUser, formatValidationErrorMessage };

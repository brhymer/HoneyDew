const db = require("../models");

async function getUser(searchParameters) {
  return await db.User.findOne(searchParameters);
}

async function createUser(userData) {
  return await db.User.create(userData);
}
module.exports = { getUser, createUser };

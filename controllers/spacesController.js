const db = require("../models");

// Index
async function getSpaces() {
  return await db.Space.find();
}

// async function getFullSpaces will be needed here as spacesRoutes adds functionality

// Show
async function getSpaceById(id) {
  return await db.Space.findById(id);
}

// async function getFullSpaceById will be needed here as spacesRoutes adds functionality

// Create
async function createSpace(reqBody) {
  const newSpace = { ...reqBody };
  return await db.Space.create(newSpace);
}

// Update
async function updateSpaceById(id, reqBody) {
  const updatedSpace = { ...reqBody };
  return await db.Space.findByIdAndUpdate(id, updatedSpace, { new: true });
}

// Delete
async function deleteSpaceById(id) {
  return await db.Space.findByIdAndDelete(id);
}

module.exports = {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpaceById,
  deleteSpaceById,
};

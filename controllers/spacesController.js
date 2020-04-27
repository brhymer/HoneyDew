const db = require("../models");

async function getSpaceOwner(id) {
  const thisSpace = await db.Space.findById(id)
    .populate({ path: "userId" })
    .exec();
  return thisSpace.userId;
}

// Index
async function getSpaces() {
  return await db.Space.find();
}

// async function getFullSpaces will be needed here as spacesRoutes adds functionality

// Show & Edit
async function getSpaceById(id) {
  return await db.Space.findById(id);
}

// async function getFullSpaceById will be needed here as spacesRoutes adds functionality

// Create
async function createSpace(spaceInformation, userId) {
  spaceInformation.userId = userId;

  const [newSpace, thisUser] = await Promise.all([
    db.Space.create(spaceInformation),
    db.User.findById(userId),
  ]);
  thisUser.spaces.push(newSpace);
  await thisUser.save();
  return newSpace;
}

// // Edit
// async function getFullSpaceById(id) {
//   const foundSpace = { }
// }

// Update
async function updateSpaceById(id, reqBody) {
  const updatedSpace = { ...reqBody };
  return await db.Space.findByIdAndUpdate(id, updatedSpace, { new: true });
}

// Delete
async function deleteSpaceById(spaceId, userId) {
  const [deletedSpace, thisUser] = await Promise.all([
    db.Space.findByIdAndDelete(spaceId),
    db.User.findById(userId),
  ]);
  thisUser.spaces.remove(spaceId);
  await thisUser.save();
  return deletedSpace;
}

module.exports = {
  getSpaceOwner,
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpaceById,
  deleteSpaceById,
};

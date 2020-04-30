const db = require("../models");

async function getSpaceOwner(id) {
  const thisSpace = await db.Space.findById(id)
    .populate({ path: "userId" })
    .exec();
  return thisSpace.userId;
}

async function getSpaces(searchParameters) {
  return await db.Space.find(searchParameters);
}

async function getSpaceById(id) {
  return await db.Space.findById(id);
}

async function getSpaceWithTasks(spaceId) {
  return await db.Space.findById(spaceId).populate({ path: "tasks" }).exec();
}

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

// Update
async function updateSpaceById(id, reqBody) {
  const updatedSpace = { ...reqBody };
  return await db.Space.findByIdAndUpdate(id, updatedSpace, { new: true });
}

// Delete
async function deleteSpaceById(spaceId, userId) {
  const [deletedSpace, thisUser] = await Promise.all([
    db.Space.findByIdAndDelete(spaceId),
    db.User.findByIdAndUpdate(userId, { $pull: { spaces: spaceId } }),
  ]);
  await db.Task.deleteMany({ _id: { $in: deletedSpace.tasks } });
  // thisUser.spaces.remove(spaceId);
  // await thisUser.save();
  return deletedSpace;
}

module.exports = {
  getSpaceOwner,
  getSpaces,
  getSpaceById,
  getSpaceWithTasks,
  createSpace,
  updateSpaceById,
  deleteSpaceById,
};

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

async function getFullSpace(spaceId) {
  return await db.Space.findById(spaceId)
    .populate({ path: "tasks" })
    .populate({ path: "spaces" })
    .exec();
}

// Create
async function createSpace(spaceInformation, userId) {
  spaceInformation.userId = userId;
  spaceInformation.parentSpace = spaceInformation.spaceId;
  const [newSpace, thisUser, parentSpace] = await Promise.all([
    db.Space.create(spaceInformation),
    db.User.findById(userId),
    db.Space.findById(spaceInformation.spaceId),
  ]);
  if (parentSpace) {
    parentSpace.spaces.push(newSpace);
    await parentSpace.save();
  }
  thisUser.spaces.push(newSpace);
  await thisUser.save();
  return newSpace;
}

// Update
async function updateSpaceById(id, spaceInformation) {
  const updatedSpace = { ...spaceInformation };
  updatedSpace.parentSpace = spaceInformation.spaceId;
  const startingSpace = await db.Space.findById(id);
  if (
    startingSpace.parentSpace.toString() !== updatedSpace.spaceId.toString()
  ) {
    const originalParent = await db.Space.findById(startingSpace.parentSpace);
    originalParent.spaces.remove(id);
    await originalParent.save();
    const newParent = await db.Space.findById(updatedSpace.spaceId);
    newParent.spaces.push(id);
    await newParent.save();
  }

  return await db.Space.findByIdAndUpdate(id, updatedSpace, { new: true });
}

async function addSelfParent(id) {
  return await db.Space.findByIdAndUpdate(id, { parentSpace: id });
}

// Delete
async function deleteSpaceById(spaceId, userId) {
  const [deletedSpace, thisUser, parentSpace] = await Promise.all([
    db.Space.findByIdAndDelete(spaceId),
    db.User.findByIdAndUpdate(userId, { $pull: { spaces: spaceId } }),
    db.Space.findOne({ spaces: spaceId }),
  ]);
  if (parentSpace) {
    parentSpace.spaces.remove(spaceId);
    await parentSpace.save();
  }
  await db.Task.deleteMany({ _id: { $in: deletedSpace.tasks } });
  thisUser.spaces.remove(spaceId);
  await thisUser.save();
  return deletedSpace;
}

module.exports = {
  getSpaceOwner,
  getSpaces,
  getSpaceById,
  getFullSpace,
  createSpace,
  updateSpaceById,
  addSelfParent,
  deleteSpaceById,
};

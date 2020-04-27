const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    features: {
      any: {},
      // To Do: expand on what type of properties 'features' will have
    },
    // These properties still need fleshing out
    Spaces: [],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Tasks: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  },
  { timestamps: true }
);

const Space = mongoose.model("Space", SpaceSchema);

module.exports = Space;

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
    },
    spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Space" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Space = mongoose.model("Space", SpaceSchema);

module.exports = Space;

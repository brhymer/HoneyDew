const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    complete: { type: Boolean, default: false },
    dueDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space" },
    imgUrl: String,
    imgPublicId: String,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;

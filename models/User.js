const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    imgUrl: String,
    imgPublicId: String,
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    // joined: {
    //   type:
    // }
    password: { type: String },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Space" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

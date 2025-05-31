const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    bio: {
      default: "Hyy , I am Using QuickChat",
      type: String,
    },
    otp: {
      type: Number,
      // required: true,
    },
    otpTimer: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);

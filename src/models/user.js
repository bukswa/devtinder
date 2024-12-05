const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 5 },
    lastName: String,
    emailId: { type: String },
    password: String,
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender validation failed");
        }
      },
    },
    about: { type: String, default: "This is default value" },
    photoUrl: { type: String },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

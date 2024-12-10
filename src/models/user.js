const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 5 },
    lastName: String,
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email: " + value);
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a valid password: " + value);
        }
      },
    },
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
    photoUrl: {
      type: String,
      default:
        "https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Not a valid url: " + value);
        }
      },
    },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tiner@$", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);

const express = require("express");
const { red, green, reset } = require("./config/constants");
const app = express();
const connnectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const PORT = 7777;
const ALLOWED_FIELDS = ["photoUrl", "age", "gender", "skills", "about"];

// Middleware for parsing all the req, res json object
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Bad Request: " + error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Not a valid email");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    res.send("login successful");
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
  }
});

// Get a user
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update the user
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;
    console.log({ data });
    let isUpdateAllowed = !!Object.keys(data).every((item) => {
      return ALLOWED_FIELDS.includes(item);
    });

    if (data?.skills) {
      isUpdateAllowed = data.skills.length < 10;
    }
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnOriginal: true,
    });

    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Update failed: " + error);
  }
});
// Feed api- GET /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connnectDB()
  .then((res) => {
    console.log(green, "=> Database connection established");
    app.listen(PORT, () => {
      console.log(reset, `server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(red, "Database connection failed");
  });

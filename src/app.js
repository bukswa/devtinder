const express = require("express");

const { red, green, reset } = require("./config/constants");
const app = express();
const connnectDB = require("./config/database");
const User = require("./models/user");
const PORT = 7777;
const ALLOWED_FIELDS = ["photoUrl", "age", "gender", "skills", "about"];

// Middleware for parsing all the req, res json object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
  } catch (error) {
    res.status(400).send("Bad Request");
  }
  res.send("User added successfully");
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
    const isUpdateAllowed =
      data?.keys?.every((item) => {
        return ALLOWED_FIELDS.includes(item);
      }) || data.skills.length < 10;
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnOriginal: true,
    });
    console.log(user);
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

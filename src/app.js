const express = require("express");
const { red, green, reset } = require("./config/constants");

const connnectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 7777;
const ALLOWED_FIELDS = ["photoUrl", "age", "gender", "skills", "about"];

// Middleware for parsing all the req, res json object
app.use(express.json());
// to parse the cookies
app.use(cookieParser());

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

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJwtToken();

    // send token in cookie
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    res.send("login successful");
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Bad Request: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + ": sent a connection request");
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

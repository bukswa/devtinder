const express = require("express");
const { red, green, reset } = require("./config/constants");

const connnectDB = require("./config/database");
require("./utils/validation");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

require("./middlewares/auth");

const app = express();
const PORT = 7777;
// const ALLOWED_FIELDS = ["photoUrl", "age", "gender", "skills", "about"];

// Middleware for parsing all the req, res json object
app.use(express.json());
// to parse the cookies
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connnectDB()
  .then(() => {
    console.log(green, "=> Database connection established");
    app.listen(PORT, () => {
      console.log(reset, `server is listening on ${PORT}`);
    });
  })
  .catch(() => {
    console.log(red, "Database connection failed");
  });

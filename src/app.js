const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

const PORT = 7777;
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("all data sent");
});

app.get("/user/login", (req, res) => {
  res.send("Please login");
});

app.get("/user/role", userAuth, (req, res) => {
  res.send("user data");
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

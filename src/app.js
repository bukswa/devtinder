const express = require("express");
const app = express();

const PORT = 7777;

app.use("/test", (req, res) => {
  res.send("Test Page: Hello from the server!");
});

app.use("/", (req, res) => {
  res.send("Home page");
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

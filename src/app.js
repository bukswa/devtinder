const express = require("express");
const app = express();

const PORT = 7777;

// app.use("/", (req, res) => {
//   res.send("Home page");
// });

// app.use("/hello", (req, res) => {
//     res.send("Hello Page: Hello from the server!");
//   });

// app.use("/test/2", (req, res) => {
//   res.send("Test Page: Sub route 2");
// });

// app.use will match all the HTTP methods to the route
// where as app.get will only match HTTP:GET method

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({ firstName: "aqeel", lastName: "ahmad" });
});
app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "aqeel", lastName: "ahmad" });
});

app.get("/user/:userId/:pwd", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "aqeel", lastName: "ahmad" });
});

app.post("/user", (req, res) => {
  res.send("successfully saved");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully");
});

app.use("/test", (req, res) => {
  res.send("Test Page: Main Route");
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

// /ab?c  => /abc , /ac
// /ab+c  => /abbc, /abbbc, /abbbbc etc
// /ab*cd  => /abcd, /abahmadcd, /abrcd -> anything between works
// /a(bc)?d  => /abcd, /ad

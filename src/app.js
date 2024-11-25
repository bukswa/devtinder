const express = require("express");
const app = express();

const PORT = 7777;

app.get("/admin/getAllData", (req, res) => {
  // try{
  throw new Error("");
  res.send("all data sent");
  // }
  // catch(error){
  //  res.status(500).send("Something went wrong.");
  // }
});

app.use("/", (err, req, res, next) => {});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

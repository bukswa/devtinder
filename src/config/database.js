const mongoose = require("mongoose");

const connnectDB = async function () {
  await mongoose.connect(
    "mongodb+srv://bukswa:C7Glvk84ixIjo2MP@cluster0.nzdf0.mongodb.net/devTinder"
  );
};

module.exports = connnectDB;

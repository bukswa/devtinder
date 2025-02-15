const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is Invalid!");
    }
    const decodedToken = jwt.verify(token, "Dev@Tiner@$");

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("" + error);
  }
};

module.exports = { userAuth };

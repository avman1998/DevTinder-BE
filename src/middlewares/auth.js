const jwt = require("jsonwebtoken");
const User = require("../models/user");
async function userAuth(req, res, next) {
  try {
    const cookies = req.cookies;
    // validate my token

    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@TINDER$1234");
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
}

module.exports = { userAuth };

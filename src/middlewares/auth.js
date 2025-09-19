const jwt = require("jsonwebtoken");
const User = require("../models/user");
async function userAuth(req, res, next) {
  try {
    const cookies = req.cookies;
    // validate my token
    console.log("cookies", req.cookies);
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("ERROR: unauthorized access");
    }

    const decodedMessage = await jwt.verify(token, "DEV@TINDER$1234");
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
}

module.exports = { userAuth };

const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { validateProfileEditData } = require("../utils/validation");
const validator = require("validator");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("req body", req.body);
    if (!validateProfileEditData(req))
      throw new Error("Cannot upadte the profile.");

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser.firstName}'s profile updated successfully!!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.password;
    if (!validator.isStrongPassword(newPassword))
      throw new Error("Enter strong password!!");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const loggedInUser = req.user;
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser.firstName}'s password is updated`,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;

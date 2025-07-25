const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // Status validations
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status is invalid",
        });
      }

      //Validate toUser
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User does not exist",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(200).json({
          message: "Connection request exists!!",
        });
      }
      const data = await connectionRequest.save();
      res.status(200).json({
        message:
          status == "interested"
            ? `${req.user.firstName} is interested in ${toUser.firstName}`
            : status === "ignored"
            ? `${req.user.firstName} has ignored ${toUser.firstName}`
            : ``,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: hello " + error.message);
    }
  }
);

module.exports = requestRouter;

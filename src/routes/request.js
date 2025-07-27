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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //   Status validation
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status))
        return res.status(400).json({
          message: "Status is not valid.",
        });

      // Validate connection request - requestId ,status should only be interested,loggedInId === toUserId

      const connectionRequest = await ConnectionRequest.findOne({
        status: "interested",
        _id: requestId,
        toUserId: loggedInUser._id,
      });

      if (!connectionRequest)
        return res.status(404).json({
          message: "Connection request does not exist.",
        });

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      return res.status(200).json({
        message: "Connection requested " + status,
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = requestRouter;

// "emailId": "Aman Verma",
// "password": "AmanVerma@1234",

// "emailId": "riyabatra@gmail.com",
// "password": "riyabatra@1234",

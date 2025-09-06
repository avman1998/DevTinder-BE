const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");

// first, connect to DB, then allow to read requests.
connectDB()
  .then(() => {
    console.log("Database connection established....");
  })
  .catch((err) => {
    console.log("Database cannot be connected: ", err);
  });
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

function checkSkillsLen(skills) {
  return skills?.length > 3 ? false : true;
}

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", requestRouter);

app.use("/", userRouter);
//Profile

// Get user by email - /user
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.findOne({ emailId: userEmail });
    if (user || Object.keys(user).length > 0) {
      res.status(200).send(user);
    }
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    // } else res.status(200).send(users);
  } catch (err) {
    res.status(404).send("Something went wrong!! " + err);
  }
});

//Feed API - get /feed
// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     console.log("users feed", users);
//     if (users.length === 0) res.status(404).send("Users are not found.");
//     else res.status(200).send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong!!" + err);
//   }
// });

// Get user by id - get /id
app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user || Object.keys(user).length > 0) {
      res.status(200).send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!" + err);
  }
});

// Delete user by Id
app.delete("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (user || Object.keys(user).length > 0) {
      res.status(200).send("User deleted successfully.");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!" + err);
  }
});

//Update user by ID
app.patch("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    // const user = await User.findByIdAndUpdate({ _id: id }, data, {
    //   returnDocument: "after",
    // });
    const user = await User.findByIdAndUpdate({ _id: id }, data, {
      runValidators: true,
    });
    const ALLOWED_UPDATES = [
      "age",
      "gender",
      "photoURL",
      "firstName",
      "lastName",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    //Checking if update is allowed or not
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed.");
    }
    //Skills should not be more than 3
    if (!checkSkillsLen(data?.skills)) {
      throw new Error("Number of skills should not be more than 3");
    }

    if (user || Object.keys(user).length > 0) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!" + error);
  }
});

const PORT = 8888;

app.listen(PORT, () => {
  console.log("I am listening to this ", PORT);
});

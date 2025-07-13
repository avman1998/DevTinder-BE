const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

// first, connect to DB, then allow to read requests.
connectDB()
  .then(() => {
    console.log("Database connection established....");
  })
  .catch((err) => {
    console.log("Database cannot be connected: ", err);
  });

const app = express();
app.use(express.json());

//adding a user to  database.
app.post("/signup", async (req, res) => {
  const body = req.body;
  const user = new User(body);
  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error after saving the user: ", err.message);
  }
});

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
    res.status(404).send("Something went wrong!!");
  }
});

//Feed API - get /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) res.status(404).send("Users are not found.");
    else res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

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
    res.status(400).send("Something went wrong!!");
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
    res.status(400).send("Something went wrong!!");
  }
});

//Update user by ID
app.patch("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log("id", id, data);
    // const user = await User.findByIdAndUpdate({ _id: id }, data, {
    //   returnDocument: "after",
    // });
    const user = await User.findByIdAndUpdate(id, data);
    console.log("user", user);
    if (user || Object.keys(user).length > 0) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!");
  }
});

const PORT = 8888;

app.listen(PORT, () => {
  console.log("I am listening to this ", PORT);
});

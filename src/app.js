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

const PORT = 8888;

app.listen(PORT, () => {
  console.log("I am listening to this ", PORT);
});

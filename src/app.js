const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
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

function checkSkillsLen(skills) {
  return skills?.length > 3 ? false : true;
}

//adding a user to  database.
app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    if (!checkSkillsLen(user?.skills)) {
      throw new Error("Number of skills should not be more than 3");
    }

    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Login api - /login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Email or password is incorrect.");

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      res.status(200).send("Login successfull!");
    } else throw new Error("Email or password is incorrect.");
  } catch (error) {
    res.status(400).send("ERROR: " + error);
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
    res.status(404).send("Something went wrong!! " + err);
  }
});

//Feed API - get /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) res.status(404).send("Users are not found.");
    else res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!!" + err);
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

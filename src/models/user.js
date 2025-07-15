const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      validate(str) {
        function containsSpecialChars(str) {
          const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
          return specialChars.test(str);
        }
        if (containsSpecialChars(str))
          throw new Error("First name cannot contain special characters");
      },
    },
    lastName: {
      type: String,
      validate(str) {
        function containsSpecialChars(str) {
          const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
          return specialChars.test(str);
        }
        if (containsSpecialChars(str))
          throw new Error("Last name cannot contain special characters");
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(password) {
        if (!validator.isStrongPassword(password)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
    },
    photoURL: {
      type: String,
      default:
        "https://www.parkcityflyfishing.com/wp-content/uploads/Dummy-Profile-Picture.jpg",
      validate(URL) {
        if (!validator.isURL(URL)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is my tinder profile",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

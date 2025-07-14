const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        const genderOptions = ["male", "female", "others"];
        if (!genderOptions.includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://www.parkcityflyfishing.com/wp-content/uploads/Dummy-Profile-Picture.jpg",
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

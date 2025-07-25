const validator = require("validator");
function validateSignUpData(req) {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
}

function validateProfileEditData(req) {
  console.log("req", req.body);
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoURL",
    "about",
    "skills",
  ];

  const isAllowedEdit = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowedEdit;
}

module.exports = { validateSignUpData, validateProfileEditData };

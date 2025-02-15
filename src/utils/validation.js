const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("Name should be between 4 and 50 chars");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateEditProfileData = (data) => {
  const isAllowedFields = [
    "firstName",
    "lastName",
    "gender",
    "about",
    "skills",
    "email",
  ];

  const isEditAllowed = Object.keys(data).every((key) =>
    isAllowedFields.includes(key)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };

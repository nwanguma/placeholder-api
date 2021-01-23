const User = require("../models/user.js");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const body = _.pick(req.body, ["username", "email", "password"]);
  const newUser = new User(body);

  try {
    const user = await newUser.save();
    const userWithProfile = await user.generateProfile();
    const token = await userWithProfile.generateAuthToken();

    res.json({
      success: true,
      data: {
        user: userWithProfile,
        token,
      },
    });
  } catch (e) {
    res.status(400).send({
      success: false,
      code: 400,
    });
  }
};

const loginUser = async (req, res) => {
  const body = _.pick(req.body, ["username", "email", "password"]);
  const { username, email, password } = body;

  try {
    const user = await User.findByCredentials(username, email, password);
    const token = await user.generateAuthToken();

    if (!token) {
      throw new Error({ status: 400, message: "bad request" });
    }

    res.json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      code: 400,
    });
  }
};

const changeUserPassword = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, [
    "oldPassword",
    "password",
    "passwordConfirmation",
  ]);

  const { oldPassword, password, passwordConfirmation } = body;
  let errors = [];

  if (!oldPassword) errors.push("old password is required");
  if (!password) errors.push("password is required");
  if (!passwordConfirmation) errors.push("password confirmation is required");
  if (password !== passwordConfirmation) errors.push("passwords do not match");

  bcrypt.compare(oldPassword, user.password, async (err, result) => {
    if (!result) errors.push("password is incorrect");

    if (errors.length > 0) {
      res.status(400).send({ success: false, code: 400, errors });
    } else {
      user.password = password;

      try {
        res.status(201).json({
          success: true,
          message: "password updated successfully",
        });
      } catch (e) {
        res.status(400).json({
          success: false,
          message: "An error occurred",
        });
      }
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  changeUserPassword,
};

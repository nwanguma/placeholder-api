const User = require("../models/user.js");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError.js");
const sendWelcomeEmail = require("../emails/account.js");

const createUser = async (req, res) => {
  const body = _.pick(req.body, ["username", "email", "password"]);

  const newUser = new User(body);

  const user = await newUser.save();
  const userWithProfile = await user.generateProfile();
  sendWelcomeEmail(user.username, user.email);
  const token = await userWithProfile.generateAuthToken();

  res.json({
    success: true,
    data: {
      user: userWithProfile,
      token,
    },
  });
};

const loginUser = async (req, res) => {
  const body = _.pick(req.body, ["username", "email", "password"]);
  const { username, email, password } = body;

  const user = await User.findByCredentials(username, email, password);
  const token = await user.generateAuthToken();
  const userWithValues = await user
    .populate("challenges")
    .populate("completedChallenges")
    .execPopulate();

  res.json({
    success: true,
    data: {
      token,
      user: userWithValues,
    },
  });
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
        await user.save();

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

const getUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new AppError("User not found", 404);
  } else {
    const userWithProfile = await user.populate("profile").execPopulate();

    res.send({
      success: true,
      data: userWithProfile,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  changeUserPassword,
  getUser,
};

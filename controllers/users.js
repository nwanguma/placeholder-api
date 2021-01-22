const User = require("../models/user.js");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const body = _.pick(req.body, ["username", "email", "password"]);
  const newUser = new User(body);

  try {
    const user = await newUser.save();
    const userWithProfile = await user.generateProfile();

    const token = userWithProfile.generateAuthToken();

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
    const user = User.findByCredentials(username, email, password);
    //find by credentials, if found compare passwords if passwords match generate auth token else return invalid etc
  } catch (e) {
    res.status(400).json({
      success: false,
      code: 400,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
};

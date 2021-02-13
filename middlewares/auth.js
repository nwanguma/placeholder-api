const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");

  try {
    const user = await User.findByToken(token);

    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = authenticate;

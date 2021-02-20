const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const AppError = require("../utils/AppError.js");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");

  try {
    const user = await User.findByToken(token);

    if (!user) throw new AppError("User not authorized", 401);

    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = authenticate;

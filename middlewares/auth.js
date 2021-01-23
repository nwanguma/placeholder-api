const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");

  try {
    const user = await User.findByToken(token);

    if (!user) throw new Error({ code: 401, message: "user not authorized" });

    req.user = user;

    next();
  } catch (e) {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = authenticate;

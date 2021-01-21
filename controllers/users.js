const User = require("../models/user.js");
const _ = require("lodash");

const createUser = async (req, res) => {
  const body = _.pick(req.body, ["username", "email", "password"]);
  const newUser = new User(body);

  try {
    const user = await newUser.save();

    await user.generateProfile();

    res.json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
      code: 400,
    });
  }
};

module.exports = {
  createUser,
};

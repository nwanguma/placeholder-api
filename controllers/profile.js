const Profile = require("../models/profile.js");

const createProfile = async (req, res) => {
  const body = _.pick(req.body, ["firstname", "lastname"]);
  const newProfile = new Profile(body);

  try {
    const profile = await newProfile.save();

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      code: 401,
    });
  }
};

module.exports = {
  createProfile,
};

const Profile = require("../models/profile.js");
const _ = require("lodash");
const AppError = require("../utils/AppError.js");

const getProfile = async (req, res) => {
  const user = req.user;

  const profile = await Profile.findOne({ user: user._id });

  if (!profile) throw new AppError("Profile not found", 404);

  res.send({
    success: true,
    data: profile,
  });
};

const createProfile = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, [
    "firstname",
    "lastname",
    "bio",
    "company",
    "githubUrl",
    "website",
  ]);
  const newProfile = new Profile({
    body,
    username: user.username,
    email: user.email,
  });

  const profile = await newProfile.save();

  res.status(201).json({
    success: true,
    data: profile,
  });
};

const editProfile = async (req, res) => {
  const user = req.user;
  const updates = {};
  const body = _.pick(req.body, [
    "firstname",
    "lastname",
    "bio",
    "email",
    "username",
    "company",
    "website",
    "githubUrl",
  ]);
  const { email, username } = body;

  if (email !== user.email)
    throw new AppError("Email update is not allowed", 403);
  if (username !== user.username)
    throw new AppError("Username update is not allowed ", 403);

  const profile = await Profile.findOneAndUpdate(
    { user: user._id },
    {
      $set: body,
    },
    { returnOriginal: false }
  );

  if (!profile) throw new AppError("Profile does not exist", 404);

  res.status(201).json({
    success: true,
    data: profile,
  });
};

module.exports = {
  createProfile,
  getProfile,
  editProfile,
};

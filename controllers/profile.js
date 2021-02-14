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
  const body = _.pick(req.body, ["firstname", "lastname"]);
  const newProfile = new Profile(body);

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
    "company",
    "website",
    "githubUrl",
  ]);
  const { firstname, lastname, bio, company, website, githubUrl } = body;

  if (firstname) updates.firstname = firstname;
  if (lastname) updates.lastname = lastname;
  if (bio) updates.bio = bio;
  if (company) updates.company = company;
  if (website) updates.website = website;
  if (githubUrl) updates.githubUrl = githubUrl;

  const profile = await Profile.findOneAndUpdate(
    { user: user._id },
    {
      $set: updates,
    }
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

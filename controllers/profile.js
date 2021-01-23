const Profile = require("../models/profile.js");
const _ = require("lodash");

const getProfile = async (req, res) => {
  const user = req.user;

  try {
    const profile = await Profile.findOne({ user: user._id });

    if (!profile) throw new Error();

    res.send({
      success: true,
      data: profile,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

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

  try {
    const profile = await Profile.updateOne(
      { user: user._id },
      {
        $set: updates,
      },
      { returnOriginal: true }
    );

    if (!profile) throw new Error();

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  editProfile,
};

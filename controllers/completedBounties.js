const CompletedBounty = require("../models/completedBounty.js");
const _ = require("lodash");
const mongodb = require("mongodb");

const createdCompletedBounty = async (req, res) => {
  const user = req.user;
  const bountyId = req.params.id;
  const completedBountyId = new mongodb.ObjectID();
  const body = _.pick(req.body, [
    "comments",
    "challengeRepo",
    "website",
    "githubUrl",
    "employmentStatus",
  ]);

  if (!bountyId)
    res.status(400).json({
      success: false,
      message: "missing parameter",
    });

  const newCompletedBounty = new CompletedBounty({
    ...body,
    user: user._id,
    bounty: bountyId,
    _id: completedBountyId,
  });

  try {
    const completedBounty = await newCompletedBounty.save();

    if (!completedBounty) throw new Error();

    res.status(201).json({
      success: true,
      data: completedBounty,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
    });
  }
};

const getUserCompletedBounties = async (req, res) => {
  const user = req.user;

  try {
    const completedBounties = await CompletedBounty.find({
      user: user._id,
    });

    if (completedBounties.length === 0) throw new Error();

    res.json({
      success: true,
      data: completedBounties,
    });
  } catch (e) {
    res.json({
      success: false,
    });
  }
};

const getUserCompletedBounty = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  try {
    const completedBounty = await CompletedBounty.findOne({
      user: user._id,
      _id: id,
    });

    if (!completedBounty) throw new Error();

    res.json({
      success: true,
      data: completedBounty,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = {
  createdCompletedBounty,
  getUserCompletedBounties,
  getUserCompletedBounty,
};

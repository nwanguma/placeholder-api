const CompletedChallenge = require("../models/completedChallenge.js");
const _ = require("lodash");
const mongodb = require("mongodb");

const createCompletedChallenge = async (req, res) => {
  const user = req.user;
  const challengeId = req.params.id;
  const completedChallengeId = new mongodb.ObjectID();
  const body = _.pick(req.body, [
    "comments",
    "challengeRepo",
    "website",
    "githubUrl",
    "employmentStatus",
  ]);

  if (!challengeId)
    res.status(400).json({
      success: false,
      message: "missing parameter",
    });

  const newCompletedChallenge = new CompletedChallenge({
    ...body,
    user: user._id,
    challenge: challengeId,
    _id: completedChallengeId,
  });

  try {
    const completedChallenge = await newCompletedChallenge.save();

    if (!completedChallenge) throw new Error();

    res.status(201).json({
      success: true,
      data: completedChallenge,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
    });
  }
};

const getUserCompletedChallenges = async (req, res) => {
  const user = req.user;

  try {
    const completedChallenges = await CompletedChallenge.find({
      user: user._id,
    });

    if (completedChallenges.length === 0) throw new Error();

    res.json({
      success: true,
      data: completedChallenges,
    });
  } catch (e) {
    res.json({
      success: false,
    });
  }
};

const getUserCompletedChallenge = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  console.log(user.email);
  console.log(id);

  try {
    const completedChallenge = await CompletedChallenge.findOne({
      user: user._id,
      _id: id,
    });

    console.log(completedChallenge);

    if (!completedChallenge) throw new Error();

    res.json({
      success: true,
      data: completedChallenge,
    });
  } catch (e) {
    res.json({
      success: false,
    });
  }
};

module.exports = {
  createCompletedChallenge,
  getUserCompletedChallenges,
  getUserCompletedChallenge,
};

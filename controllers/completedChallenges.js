const CompletedChallenge = require("../models/completedChallenge.js");
const _ = require("lodash");
const mongodb = require("mongodb");
const AppError = require("../util/AppError.js");

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

  if (!challengeId) throw new AppError("Missing parameter", 404);

  const newCompletedChallenge = new CompletedChallenge({
    ...body,
    user: user._id,
    challenge: challengeId,
    _id: completedChallengeId,
  });

  const completedChallenge = await newCompletedChallenge.save();

  if (!completedChallenge)
    throw new AppError("Completed challenge does not exist", 404);

  res.status(201).json({
    success: true,
    data: completedChallenge,
  });
};

const getUserCompletedChallenges = async (req, res) => {
  const user = req.user;

  const completedChallenges = await CompletedChallenge.find({
    user: user._id,
  });

  res.json({
    success: true,
    data: completedChallenges,
  });
};

const getUserCompletedChallenge = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  const completedChallenge = await CompletedChallenge.findOne({
    user: user._id,
    _id: id,
  });

  if (!completedChallenge)
    throw new AppError("Completed challenge does not exist", 404);

  res.json({
    success: true,
    data: completedChallenge,
  });
};

module.exports = {
  createCompletedChallenge,
  getUserCompletedChallenges,
  getUserCompletedChallenge,
};

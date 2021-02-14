const CompletedChallenge = require("../models/completedChallenge.js");
const _ = require("lodash");
const mongodb = require("mongodb");
const AppError = require("../utils/AppError.js");

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
  const queries = req.query;
  const { page, limit, title, company, stack, sortBy } = queries;
  const match = {};
  const sort = {};

  if (title) match.title = title;
  if (company) match.company = company;
  if (stack) match.stack = stack;
  if (sortBy) {
    const parts = sortBy.split(":");
    const key = parts[0];
    const value = parts[1] === "decsc" ? -1 : 1;

    sort[key] = value;
  }

  await user
    .populate({
      path: "completedChallenges",
      match,
      options: {
        skip: parseInt(page),
        limit: parseInt(limit),
        sort,
      },
    })
    .execPopulate();

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

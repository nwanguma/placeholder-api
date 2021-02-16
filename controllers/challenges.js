const _ = require("lodash");
const { ObjectID } = require("mongodb");
const Challenge = require("../models/challenge.js");
const AppError = require("../utils/AppError.js");

const createChallenge = async (req, res) => {
  const user = req.user;
  const challengeId = new ObjectID();
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "tags",
    "stack",
    "challengeRepo",
    "company",
    "companyUrl",
  ]);

  const newChallenge = new Challenge({
    ...body,
    _id: challengeId,
    user: user._id,
  });

  const challenge = await newChallenge.save();
  user.challenges.push(challengeId);

  await user.save();

  res.json({
    success: true,
    data: challenge,
  });
};

const getUserChallenges = async (req, res) => {
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
      path: "challenges",
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
    data: req.user.challenges,
  });
};

const getUserChallenge = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  const challenge = await Challenge.findOne({
    user: user._id,
    _id: id,
  }).populate("completedChallenges");

  if (!challenge) throw new AppError("Challenge does not exist", 404);

  res.json({
    success: true,
    data: challenge,
  });
};

const getChallenge = async (req, res) => {
  const id = req.params.id;

  const challenge = await Challenge.findOne({
    _id: id,
  }).populate("completedChallenges");

  if (!challenge) throw new AppError("Challenge does not exist", 404);

  res.json({
    success: true,
    data: challenge,
  });
};

const editChallenge = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "tags",
    "stack",
    "challengeRepo",
    "company",
    "companyUrl",
  ]);

  const challenge = await Challenge.findOneAndUpdate(
    {
      _id: id,
      user: user._id,
    },
    { $set: body }
  );

  if (!challenge) throw new AppError("Challenge does not exist", 404);

  res.send({
    success: true,
    data: challenge,
  });
};

const deleteChallenge = async (req, res) => {
  const id = req.params.id;

  const challenge = await Challenge.findOneAndDelete({ _id: id });

  if (!challenge) throw new AppError("Challenge does not exist", 404);

  res.send({
    success: true,
    message: "Deleted successfully",
  });
};

const getAllChallenges = async (req, res) => {
  const queries = req.query;
  const { page, limit, title, company, stack, sort } = queries;
  const match = {};

  if (title) match.title = title;
  if (company) match.company = company;
  if (stack) match.stack = stack;

  const challenges = await Challenge.find(match)
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort({ createdAt: sort || -1 })
    .populate("completedChallenges")
    .exec();

  res.json({
    success: true,
    data: challenges,
  });
};

module.exports = {
  createChallenge,
  getUserChallenges,
  editChallenge,
  deleteChallenge,
  getAllChallenges,
  getUserChallenge,
  getChallenge,
};

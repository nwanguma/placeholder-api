const _ = require("lodash");
const { ObjectID } = require("mongodb");
const Challenge = require("../models/challenge.js");

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

  try {
    const challenge = await newChallenge.save();
    user.challenges.push(challengeId);

    user.save();

    res.json({
      success: true,
      data: challenge,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
      code: 400,
    });
  }
};

const getUserChallenges = async (req, res) => {
  const user = req.user;
  const queries = req.query;

  try {
    await req.user.populate("challenges").execPopulate();

    res.json({
      success: true,
      // count,
      data: req.user.challenges,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const getUserChallenge = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  try {
    const challenge = await Challenge.findOne({
      user: user._id,
      _id: id,
    }).populate("completedChallenges");

    if (!challenge)
      throw {
        status: 400,
        message: "challenge not found",
      };

    res.json({
      success: true,
      data: challenge,
    });
  } catch (e) {
    res.status(e.status || 400).send({
      success: false,
      message: e.message || "An error occurred",
      status: e.status || 400,
    });
  }
};

const getChallenge = async (req, res) => {
  const id = req.params.id;

  try {
    const challenge = await Challenge.findOne({
      _id: id,
    }).populate("completedChallenges");

    if (!challenge)
      throw {
        status: 400,
        message: "challenge not found",
      };

    res.json({
      success: true,
      data: challenge,
    });
  } catch (e) {
    res.status(e.status || 400).send({
      success: false,
      message: e.message || "An error occurred",
      status: e.status || 400,
    });
  }
};

const editChallenge = async (req, res) => {
  const updates = {};
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
  const {
    title,
    description,
    instructions,
    tags,
    stack,
    challengeRepo,
    company,
    companyUrl,
  } = body;

  if (title) updates.title = title;
  if (description) updates.description = description;
  if (instructions) updates.instructions = instructions;
  if (tags) updates.tags = tags;
  if (stack) updates.stack = stack;
  if (challengeRepo) updates.challengeRepo = challengeRepo;
  if (company) updates.company = company;
  if (companyUrl) updates.companyUrl = companyUrl;

  try {
    const challenge = await Challenge.findOneAndUpdate(
      {
        _id: id,
        user: user._id,
      },
      { $set: updates }
    );

    if (!challenge) throw new Error();

    res.send({
      success: true,
      data: challenge,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const deleteChallenge = async (req, res) => {
  const id = req.params.id;

  try {
    const challenge = await Challenge.deleteOne({ _id: id });

    if (!challenge) throw new Error();

    res.send({
      success: true,
      message: "deleted successfully",
      data: challenge,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("completedChallenges")
      .exec();

    const count = await Challenge.find().count();

    if (challenges.length === 0) throw new Error();

    res.json({
      success: true,
      count,
      data: challenges,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
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

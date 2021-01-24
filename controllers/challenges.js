const _ = require("lodash");
const Challenge = require("../models/challenge.js");

const createChallenge = async (req, res) => {
  const user = req.user;
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

  const newChallenge = new Challenge({ ...body, user: user._id });

  try {
    const challenge = await newChallenge.save();

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

const getChallenges = async (req, res) => {
  const user = req.user;

  try {
    const challenges = await Challenge.find({ user: user._id })
      .populate("completedChallenges")
      .exec();

    res.json({
      success: true,
      data: challenges,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
    });
  }
};

const getChallenge = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  try {
    const challenge = await Challenge.findOne({
      user: user._id,
      _id: id,
    }).populate("completedChallenges");

    if (!challenge) throw new Error();

    res.json({
      success: true,
      data: challenge,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
    });
  }
};

const editChallenge = async (req, res) => {
  const updates = {};
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
    const challenge = await Challenge.updateOne(
      {
        _id: id,
      },
      { $set: updates }
    );

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
    const challenges = await Challenge.find();

    if (challenges.length === 0) throw new Error();

    res.json({
      success: true,
      data: challenges,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
    });
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  editChallenge,
  deleteChallenge,
  getAllChallenges,
  getChallenge,
};

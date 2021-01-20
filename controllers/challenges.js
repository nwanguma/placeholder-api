const Challenge = require("../models/Challenge.js");
const _ = require("lodash");

const createChallenge = async (req, res) => {
  const body = _.pick(req.body, [
    "title",
    "company",
    "companyUrl",
    "repo",
    "repoUrl",
  ]);

  const newChallenge = new Challenge(body);

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

module.exports = {
  createChallenge,
};

const Bounty = require("../models/bounty.js");
const _ = require("lodash");

const createBounty = async (req, res) => {
  const body = _.pick(req.body, [
    "title",
    "company",
    "companyUrl",
    "repo",
    "repoUrl",
  ]);

  const newBounty = new Bounty(body);

  try {
    const bounty = await newBounty.save();

    res.json({
      success: true,
      data: bounty,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
      code: 400,
    });
  }
};

module.exports = {
  createBounty,
};

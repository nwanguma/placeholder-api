const CompletedBounty = require("../models/completedBounty.js");
const _ = require("lodash");
const mongodb = require("mongodb");
const AppError = require("../utils/AppError.js");

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

  if (!bountyId) throw new AppError("Missing parameters", 400);

  const newCompletedBounty = new CompletedBounty({
    ...body,
    user: user._id,
    bounty: bountyId,
    _id: completedBountyId,
  });

  const completedBounty = await newCompletedBounty.save();

  if (!completedBounty)
    throw new AppError("Completed bounty does not exist", 404);

  res.status(201).json({
    success: true,
    data: completedBounty,
  });
};

const getUserCompletedBounties = async (req, res) => {
  const user = req.user;
  const queries = req.query;
  const { page, limit, title, product, sortBy } = queries;
  const match = {};
  const sort = {};

  if (title) match.title = title;
  if (product) match.product = product;
  if (sortBy) {
    const parts = sortBy.split(":");
    const key = parts[0];
    const value = parts[1] === "decsc" ? -1 : 1;

    sort[key] = value;
  }

  await user
    .populate({
      path: "completedBounties",
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
    data: completedBounties,
  });
};

const getUserCompletedBounty = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  const completedBounty = await CompletedBounty.findOne({
    user: user._id,
    _id: id,
  });

  if (!completedBounty)
    throw new AppError("Completed bounty does not exist", 404);

  res.json({
    success: true,
    data: completedBounty,
  });
};

module.exports = {
  createdCompletedBounty,
  getUserCompletedBounties,
  getUserCompletedBounty,
};

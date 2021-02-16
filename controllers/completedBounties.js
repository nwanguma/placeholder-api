const CompletedBounty = require("../models/completedBounty.js");
const _ = require("lodash");
const mongodb = require("mongodb");
const AppError = require("../utils/AppError.js");

const createdCompletedBounty = async (req, res) => {
  const user = req.user;
  const bountyId = req.params.id;
  const completedBountyId = new mongodb.ObjectID();
  const body = _.pick(req.body, [
    "name",
    "title",
    "domain",
    "subdomain",
    "description",
    "stepsToReproduce",
    "impact",
  ]);

  if (!bountyId) throw new AppError("Missing parameters", 400);

  const newCompletedBounty = new CompletedBounty({
    ...body,
    user: user._id,
    bounty: bountyId,
    _id: completedBountyId,
  });

  const completedBounty = await newCompletedBounty.save();
  user.completedBounties.push(completedBountyId);

  user.save();

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

const getCompletedBountiesByBounty = async (req, res) => {
  const bountyId = req.params.id;
  const { page, limit, sort } = req.query;

  const completedBounties = await CompletedBounty.find({
    bounty: bountyId,
  })
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort({ createdAt: sort || -1 });

  res.json({
    success: true,
    data: completedBounties,
  });
};

const getCompletedBounty = async (req, res) => {
  const completedBountyId = req.params.id;

  const completedBounty = await CompletedBounty.findOne({
    _id: completedBountyId,
  });

  if (!completedBounty)
    throw new AppError("Completed bounty does not exist", 404);

  res.json({
    success: true,
    data: completedBounty,
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

const editCompletedBounty = async (req, res) => {
  const user = req.user;
  const completedBountyId = req.params.id;
  const body = _.pick(req.body, [
    "name",
    "title",
    "domain",
    "subdomain",
    "description",
    "stepsToReproduce",
    "impact",
  ]);

  const completedBounty = await CompletedBounty.findOneAndUpdate(
    {
      user: user._id,
      _id: completedBountyId,
    },
    { $set: body }
  );

  if (!completedBounty) throw new AppError("Bounty does not exist", 404);

  res.status(201).send({
    success: true,
    data: completedBounty,
  });
};

const deleteCompletedBounty = async (req, res) => {
  const user = req.user;
  const completedBountyId = req.params.id;

  const deletedcompletedBounty = await CompletedBounty.findOneAndDelete({
    _id: completedBountyId,
    user: user._id,
  });

  if (!deletedcompletedBounty) throw new AppError("Bounty does not exist", 404);

  res.status(200).send({
    success: true,
    message: "Deleted successfully",
  });
};

module.exports = {
  createdCompletedBounty,
  getUserCompletedBounties,
  getCompletedBountiesByBounty,
  getCompletedBounty,
  getUserCompletedBounty,
  editCompletedBounty,
  deleteCompletedBounty,
};

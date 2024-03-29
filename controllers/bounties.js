const _ = require("lodash");
const { ObjectID } = require("mongodb");
const Bounty = require("../models/bounty.js");
const AppError = require("../utils/AppError.js");

const createBounty = async (req, res) => {
  const user = req.user;
  const bountyId = new ObjectID();
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "product",
    "productUrl",
  ]);

  const newBounty = new Bounty({ ...body, _id: bountyId, user: user._id });
  const bounty = await newBounty.save();
  user.bounties.push(bountyId);

  await user.save();

  res.json({
    success: true,
    data: bounty,
  });
};

const getUserBounties = async (req, res) => {
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
      path: "bounties",
      match,
      options: {
        skip: parseInt(page),
        limit: parseInt(limit),
        sort,
      },
    })
    .execPopulate();

  console.log(user);

  res.json({
    success: true,
    data: user.bounties,
  });
};

const getUserBounty = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  const bounty = await Bounty.findOne({
    user: user._id,
    _id: id,
  }).populate("completedBounties");

  if (!bounty) throw new AppError("Bounty does not exist", 404);

  res.json({
    success: true,
    data: bounty,
  });
};

const getBounty = async (req, res) => {
  const id = req.params.id;

  const bounty = await Bounty.findOne({
    _id: id,
  }).populate("completedBounties");

  if (!bounty) throw new AppError("Bounty does not exist", 404);

  res.json({
    success: true,
    data: bounty,
  });
};

const editBounty = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "product",
    "productUrl",
  ]);

  const bounty = await Bounty.findOneAndUpdate(
    {
      _id: id,
      user: user._id,
    },
    { $set: body }
  );

  if (!bounty) throw new AppError("Bounty does not exist", 404);

  res.send({
    success: true,
    data: bounty,
  });
};

const deleteBounty = async (req, res) => {
  const id = req.params.id;

  const bounty = await Bounty.deleteOne({ _id: id });

  if (!bounty) throw new AppError("Bounty does not exist", 404);

  res.send({
    success: true,
    message: "Deleted successfully",
    data: bounty,
  });
};

const getAllBounties = async (req, res) => {
  const queries = req.query;
  const { page, limit, title, description, product, sort } = queries;
  const match = {};

  if (title) match.title = title;
  if (description) match.description = description;
  if (product) match.product = product;

  const bounties = await Bounty.find(match)
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort({ createdAt: sort || -1 })
    .populate("completedChallenges")
    .exec();

  res.json({
    success: true,
    data: bounties,
  });
};

module.exports = {
  createBounty,
  getUserBounties,
  editBounty,
  deleteBounty,
  getAllBounties,
  getUserBounty,
  getBounty,
};

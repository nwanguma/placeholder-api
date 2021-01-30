const _ = require("lodash");
const Bounty = require("../models/bounty.js");

const createBounty = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "product",
    "productUrl",
  ]);

  const newBounty = new Bounty({ ...body, user: user._id });

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

const getUserBounties = async (req, res) => {
  const user = req.user;

  try {
    const bounties = await Bounty.find({ user: user._id })
      .populate("completedBounties")
      .exec();

    const count = await Bounty.find({
      user: user._id,
    }).count();

    res.json({
      success: true,
      count,
      data: bounties,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const getUserBounty = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  try {
    const bounty = await Bounty.findOne({
      user: user._id,
      _id: id,
    }).populate("completedBounties");

    if (!bounty)
      throw {
        status: 400,
        message: "bounty not found",
      };

    res.json({
      success: true,
      data: bounty,
    });
  } catch (e) {
    res.status(e.status || 400).send({
      success: false,
      message: e.message || "An error occurred",
      status: e.status || 400,
    });
  }
};

const getBounty = async (req, res) => {
  const id = req.params.id;

  try {
    const bounty = await Bounty.findOne({
      _id: id,
    }).populate("completedBounties");

    if (!bounty)
      throw {
        status: 400,
        message: "bounty not found",
      };

    res.json({
      success: true,
      data: bounty,
    });
  } catch (e) {
    res.status(e.status || 400).send({
      success: false,
      message: e.message || "An error occurred",
      status: e.status || 400,
    });
  }
};

const editBounty = async (req, res) => {
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
    const bounty = await Bounty.findOneAndUpdate(
      {
        _id: id,
        user: user._id,
      },
      { $set: updates }
    );

    if (!bounty) throw new Error();

    res.send({
      success: true,
      data: bounty,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const deleteBounty = async (req, res) => {
  const id = req.params.id;

  try {
    const bounty = await Bounty.deleteOne({ _id: id });

    if (!bounty) throw new Error();

    res.send({
      success: true,
      message: "deleted successfully",
      data: bounty,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const getAllBounties = async (req, res) => {
  try {
    const bounties = await Bounty.find().populate("completedBounties").exec();

    const count = await Bounty.find().count();

    if (bounties.length === 0) throw new Error();

    res.json({
      success: true,
      count,
      data: bounties,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
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

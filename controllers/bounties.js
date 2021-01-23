const Bounty = require("../models/bounty.js");
const _ = require("lodash");

const createBounty = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "product",
    "productUrl",
    "expiry",
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

const getBounties = async (req, res) => {
  const user = req.user;

  try {
    const bounties = await Bounty.find({ user: user._id });

    if (!bounties.length === 0) throw new Error();

    res.json({
      success: true,
      data: bounties,
    });
  } catch (e) {
    res.status(400).send({
      success: false,
    });
  }
};

const editBounty = async (req, res) => {
  const updates = {};
  const id = req.params.id;
  const body = _.pick(req.body, [
    "title",
    "description",
    "instructions",
    "product",
    "productUrl",
    "expiry",
  ]);
  const {
    title,
    description,
    instructions,
    product,
    productUrl,
    expiry,
  } = body;

  if (title) updates.title = title;
  if (description) updates.description = description;
  if (instructions) updates.instructions = instructions;
  if (product) updates.company = company;
  if (productUrl) updates.productUrl = productUrl;
  if (expiry) updates.expiry = expiry;

  try {
    const bounty = await Bounty.updateOne(
      {
        _id: id,
      },
      { $set: updates }
    );

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
    const bounties = await Bounty.find();

    if (bounties.length === 0) throw new Error();

    res.json({
      success: true,
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
  getBounties,
  editBounty,
  deleteBounty,
  getAllBounties,
};

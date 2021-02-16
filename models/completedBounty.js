const mongoose = require("mongoose");
const _ = require("lodash");
const Bounty = require("./bounty.js");

const CompletedBountySchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    domain: String,
    subdomain: String,
    description: String,
    stepsToReproduce: [String],
    impact: String,
    user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
    bounty: {
      ref: "Bounty",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

CompletedBountySchema.pre("save", async function (next) {
  const completedBounty = this;

  const bounty = await Bounty.findOne({
    _id: completedBounty.bounty,
  });

  if (bounty) {
    bounty.completedBounties.push(completedBounty._id);

    await bounty.save();

    next();
  } else {
    next();
  }
});

CompletedBountySchema.methods.toJSON = function () {
  const completedBounty = this;
  const completedBountyObject = completedBounty.toObject();

  const body = _.pick(completedBountyObject, [
    "name",
    "title",
    "domain",
    "subdomain",
    "description",
    "stepsToReproduce",
    "impact",
    "_id",
  ]);

  return body;
};

const CompletedBounty = mongoose.model(
  "CompletedBounty",
  CompletedBountySchema
);

module.exports = CompletedBounty;

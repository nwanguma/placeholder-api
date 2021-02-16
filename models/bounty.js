const mongoose = require("mongoose");
const _ = require("lodash");

const BountySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    instructions: [String],
    product: String,
    productUrl: String,
    expiry: Date,
    completedBounties: [
      {
        ref: "CompletedBounty",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

BountySchema.methods.toJSON = function () {
  const bounty = this;
  const bountyObject = bounty.toObject();

  const body = _.pick(bountyObject, [
    "title",
    "description",
    "instructions",
    "product",
    "productUrl",
    "completedBounties",
    "expiry",
  ]);

  return body;
};

const Bounty = mongoose.model("Bounty", BountySchema);

module.exports = Bounty;

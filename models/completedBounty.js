const mongoose = require("mongoose");
const _ = require("lodash");

const CompletedBountySchema = new mongoose.Schema(
  {
    comments: String,
    challengeRepo: String,
    website: String,
    githubUrl: String,
    // employmentStatus: Boolean,
    user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
    challenge: {
      ref: "Bounty",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

CompletedBountySchema.pre("save", async function (next) {
  const completedBounty = this;

  const challenge = await Challenge.findOne({
    _id: completedBounty.bounty,
  });

  if (challenge) {
    challenge.completedBountys.push(completedBounty._id);

    await challenge.save();

    next();
  } else {
    next();
  }
});

CompletedBountySchema.methods.toJSON = function () {
  const completedBounty = this;
  const completedBountyObject = completedBounty.toObject();

  const body = _.pick(completedBountyObject, [
    "comments",
    "challengeRepo",
    "website",
    "githubUrl",
    "employmentStatus",
    "_id",
  ]);

  return body;
};

const CompletedBounty = mongoose.model(
  "CompletedBounty",
  CompletedBountySchema
);

module.exports = CompletedBounty;

const mongoose = require("mongoose");
const _ = require("lodash");
const Challenge = require("./challenge.js");

const CompletedChallengeSchema = new mongoose.Schema(
  {
    comments: String,
    challengeRepo: String,
    website: String,
    githubUrl: String,
    employmentStatus: Boolean,
    user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
    challenge: {
      ref: "Challenge",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

CompletedChallengeSchema.pre("save", async function (next) {
  const completedChallenge = this;

  const challenge = await Challenge.findOne({
    _id: completedChallenge.challenge,
  });

  if (challenge) {
    challenge.completedChallenges.push(completedChallenge._id);

    await challenge.save();

    next();
  } else {
    next();
  }
});

CompletedChallengeSchema.methods.toJSON = function () {
  const completedChallenge = this;
  const completedChallengeObject = completedChallenge.toObject();

  const body = _.pick(completedChallengeObject, [
    "comments",
    "challengeRepo",
    "website",
    "githubUrl",
    "employmentStatus",
    "_id",
  ]);

  return body;
};

const CompletedChallenge = mongoose.model(
  "CompletedChallenge",
  CompletedChallengeSchema
);

module.exports = CompletedChallenge;

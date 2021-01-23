const mongoose = require("mongoose");
const _ = require("lodash");

const CompletedChallengeSchema = new mongoose.Schema(
  {
    comments: String,
    challengeRepo: String,
    website: String,
    githubUrl: String,
    employmentStatus: Boolean,
    user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
    challenge: { ref: "challenge", type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

CompletedChallengeSchema.methods.toJSON = function () {
  const completedChallenge = this;
  const completedChallengeObject = completedChallenge.toObject();

  const body = _.pick(completedChallengeObject, [
    "comments",
    "challengeRepo",
    "website",
    "githubUrl",
    "employmentStatus",
  ]);

  return body;
};

const CompletedChallenge = mongoose.model(
  "completedChallenge",
  CompletedChallengeSchema
);

const mongoose = require("mongoose");
const _ = require("lodash");

const ChallengeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    instructions: [String],
    tags: [String],
    stack: String,
    challengeRepo: String,
    company: String,
    companyUrl: String,
    user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
    completedChallenges: [
      {
        ref: "CompletedChallenge",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

ChallengeSchema.methods.toJSON = function () {
  const challenge = this;
  const challengeObject = challenge.toObject();

  const body = _.pick(challengeObject, [
    "title",
    "description",
    "instructions",
    "tags",
    "stack",
    "challengeRepo",
    "company",
    "completedChallenges",
    "companyUrl",
    "createdAt",
    "updatedAt",
  ]);

  return body;
};

const Challenge = mongoose.model("Challenge", ChallengeSchema);

module.exports = Challenge;

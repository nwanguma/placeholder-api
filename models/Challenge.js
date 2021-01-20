const mongoose = require("mongoose");
const validator = require("validator");

const ChallengeSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    companyUrl: String,
    repoUrl: String,
  },
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", ChallengeSchema);

module.exports = Challenge;

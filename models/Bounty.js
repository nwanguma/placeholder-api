const mongoose = require("mongoose");
const validator = require("validator");

const BountySchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    companyUrl: String,
    repoUrl: String,
  },
  { timestamps: true }
);

const Bounty = mongoose.model("Bounty", BountySchema);

module.exports = Bounty;

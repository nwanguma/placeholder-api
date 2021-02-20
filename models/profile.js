const mongoose = require("mongoose");
const _ = require("lodash");

const ProfileSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

ProfileSchema.methods.toJSON = function () {
  const profile = this;
  const profileObject = profile.toObject();

  const body = _.pick(profileObject, [
    "firstname",
    "lastname",
    "username",
    "email",
    "bio",
    "company",
    "githubUrl",
    "website",
  ]);

  return body;
};

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;

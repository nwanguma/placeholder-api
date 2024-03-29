const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { ObjectID } = require("mongodb");
const Profile = require("./profile");
const jwt = require("jsonwebtoken");
const { findOne } = require("./profile");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is taken"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is required"],
    },
    password: { type: String, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    completedChallenges: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CompletedChallenge" },
    ],
    completedBounties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CompletedBounty" },
    ],
    jobposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    likedJobposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    jobpostComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    productComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    blogposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    blogComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    likedBlogposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    bounties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bounty" }],
    tokens: [
      {
        token: String,
        access: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.statics.findByToken = async function (token) {
  let decoded;
  const User = this;

  try {
    decoded = jwt.verify(token, process.env.SECRET);
  } catch (e) {
    return Promise.reject({ status: 401, message: "User not authorized" });
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.access": "auth",
    "tokens.token": token,
  });
};

UserSchema.statics.findByCredentials = async function (id, password) {
  const User = this;

  const user = await User.findOne({
    $or: [{ username: id }, { email: id }],
  });

  if (!user) return Promise.reject({ status: 404, message: "User not found" });

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (!res) {
        reject({ status: 401, message: "Invalid credentials" });
      } else {
        resolve(user);
      }
    });
  });
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const access = "auth";

  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.SECRET)
    .toString();

  user.tokens.push({ token, access });

  try {
    await user.save();

    return token;
  } catch (e) {
    throw e;
  }
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  const body = _.pick(userObject, [
    "username",
    "email",
    "profile",
    "completedChallenges",
    "challenges",
  ]);

  const profileObject = body.profile;

  const profileBody = _.pick(profileObject, [
    "firstname",
    "lastname",
    "username",
    "email",
    "bio",
    "company",
    "githubUrl",
    "website",
  ]);

  return { ...body, profile: profileBody };
};

UserSchema.methods.generateProfile = async function () {
  const user = this;

  const profileId = new ObjectID();
  const newProfile = new Profile({
    _id: profileId,
    user: user._id,
    email: user.email,
    username: user.username,
  });

  await newProfile.save();

  user.profile = newProfile._id;

  return user.save();
};

UserSchema.pre("save", function (next) {
  const user = this;

  user.populate("profile").execPopulate();

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;

        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

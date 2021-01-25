const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { ObjectID } = require("mongodb");
const Profile = require("./profile");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    tokens: [
      {
        token: String,
        access: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.statics.findByToken = function (token) {
  let decoded;
  const User = this;

  try {
    decoded = jwt.verify(token, process.env.SECRET);
  } catch (e) {
    return Promise.reject({ code: 401, message: "user not authorized" });
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.access": "auth",
    "tokens.token": token,
  });
};

UserSchema.statics.findByCredentials = async function (
  username,
  email,
  password
) {
  const User = this;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) return Promise.reject({ code: 400, message: "user not found" });

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (!res) {
        reject({ code: 401, message: "invalid credentials" });
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
    throw new Error(e);
  }
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  const body = _.pick(userObject, ["username", "email", "profile"]);

  return body;
};

UserSchema.methods.generateProfile = async function () {
  const user = this;
  const profileId = new ObjectID();
  const newProfile = new Profile({ _id: profileId, user: user._id });

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

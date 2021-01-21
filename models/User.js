const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { ObjectID } = require("mongodb");
const Profile = require("./profile");

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

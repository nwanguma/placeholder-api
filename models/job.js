const mongoose = require("mongoose");
const _ = require("lodash");

const { Schema, model } = mongoose;

const jobSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
  },
  responsibilities: {
    type: [String],
  },
  tags: [String],
  location: String,
  stack: String,
  qualifications: {
    type: String,
  },
  benefits: {
    type: String,
  },
  company: {
    type: String,
    required: true,
  },
  companyUrl: {
    type: String,
    required: true,
  },
  applicationUrl: {
    type: String,
    required: true,
  },

  likes: [
    {
      author: String,
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      text: String,
      author: String,
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

jobSchema.methods.toJSON = function () {
  const job = this;
  const jobObject = job.toObject();

  const body = _.pick(jobObject, [
    "title",
    "description",
    "responsibilities",
    "tags",
    "stack",
    "qualifications",
    "perks",
    "company",
    "companyUrl",
    "likes",
    "comments",
    "_id",
    "createdAt",
    "applicationUrl",
    "location",
  ]);

  return body;
};

const Job = model("Job", jobSchema);

module.exports = Job;

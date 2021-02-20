const Job = require("../models/job.js");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const AppError = require("../utils/AppError.js");

const postJob = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, [
    "title",
    "description",
    "responsibilities",
    "tags",
    "stack",
    "qualifications",
    "benefits",
    "company",
    "companyUrl",
    "applicationUrl",
  ]);
  const jobpostId = new ObjectID();

  await user.populate("profile");
  const { firstname, lastname } = user.profile;

  author = firstname && lastname ? `${firstname} ${lastname}` : user.username;
  const newJobpost = new Job({
    ...body,
    _id: jobpostId,
    author,
    user: user._id,
  });

  user.jobposts.push(jobpostId);

  await user.save();
  const jobpost = await newJobpost.save();

  res.status(201).json({
    success: true,
    data: jobpost,
  });
};

const getJobposts = async (req, res) => {
  const queries = req.query;

  const { page, limit, sort } = queries;

  const jobposts = await Job.find()
    .populate("likes")
    .populate("comments")
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort({ createdAt: sort || -1 })
    .exec();

  res.json({
    success: true,
    data: jobposts,
  });
};

const getUserJobposts = async (req, res) => {
  const user = req.user;
  const queries = req.query;
  const { page, limit, title, sortBy } = queries;
  const match = {};
  const sort = {};

  if (title) match.title = title;
  if (sortBy) {
    const parts = sortBy.split(":");
    const key = parts[0];
    const value = parts[1] === "desc" ? -1 : 1;

    sort[key] = value;
  }

  await user
    .populate({
      path: "jobposts",
      match,
      options: {
        skip: parseInt(page),
        limit: parseInt(limit),
        sort,
      },
    })
    .execPopulate();

  res.json({
    success: true,
    data: req.user.jobposts,
  });
};

const editJobpost = async (req, res) => {
  const jobpostId = req.params.id;
  const user = req.user;
  const updates = _.pick(req.body, [
    "title",
    "description",
    "responsibilities",
    "tags",
    "stack",
    "qualifications",
    "perks",
    "company",
    "companyUrl",
  ]);

  const jobpost = await Job.findOneAndUpdate(
    { _id: jobpostId, user: user._id },
    { $set: updates }
  );

  if (!jobpost) throw new AppError("Post does not exist", 404);

  res.json({
    success: true,
    data: jobpost,
  });
};

const getJobpost = async (req, res) => {
  const jobpostId = req.params.id;
  const jobpost = await Job.findOne({ _id: jobpostId })
    .populate("likes")
    .populate("comments");

  if (!jobpost) throw new AppError("Post not found", 404);

  res.json({
    success: true,
    data: jobpost,
  });
};

const getUserJobpost = async (req, res) => {
  const jobpostId = req.params.id;
  const user = req.user;

  const jobpost = await Job.findOne({ _id: jobpostId, user: user._id })
    .populate("likes")
    .populate("comments");

  if (!jobpost) throw new AppError("Post not found", 404);

  res.json({
    success: true,
    data: jobpost,
  });
};

const deleteJobpost = async (req, res) => {
  const user = req.user;
  const jobpostId = req.params.id;
  const jobpost = await Job.findOneAndDelete({
    _id: jobpostId,
    user: user._id,
  });

  if (!jobpost) throw new AppError("Post does not exist", 404);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
};

const likeJobpost = async (req, res) => {
  const jobpostId = req.params.id;
  const user = req.user;

  const hasLiked = await Job.findOne({
    _id: jobpostId,
    "likes.authorId": user._id,
  });

  if (hasLiked)
    res
      .status(400)
      .json({ success: false, message: "User has already liked this post" });

  const jobpost = await Job.findOneAndUpdate(
    { _id: jobpostId },
    {
      $push: {
        likes: {
          authorId: user._id,
          author: user.username,
        },
      },
    }
  );

  if (!jobpost) throw new AppError("Post does not exist", 404);

  user.likedJobposts.push(jobpostId);

  await user.save();

  res.json({
    success: true,
    message: "Liked successfully",
  });
};

const commentOnJobpost = async (req, res) => {
  const jobpostId = req.params.id;
  const body = _.pick(req.body, ["id", "text"]);
  const user = req.user;

  const { text } = body;

  if (!text) throw new AppError("Text is required", 400);

  const jobpost = await Job.findOneAndUpdate(
    { _id: jobpostId },
    {
      $push: {
        comments: {
          author: user.username,
          authorId: user._id,
          text,
        },
      },
    }
  );

  if (!jobpost) throw new AppError("Post does not exist", 404);

  user.blogComments.push(jobpostId);

  await user.save();

  res.json({
    success: true,
    message: "Comment posted successfully",
  });
};

module.exports = {
  postJob,
  getJobposts,
  getJobpost,
  editJobpost,
  deleteJobpost,
  getUserJobpost,
  getUserJobposts,
  likeJobpost,
  commentOnJobpost,
};

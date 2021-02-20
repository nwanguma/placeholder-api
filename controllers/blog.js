const Blog = require("../models/blog.js");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const AppError = require("../utils/AppError.js");

const postBlogpost = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, ["title", "body"]);
  const blogpostId = new ObjectID();

  await user.populate("profile");
  const { firstname, lastname } = user.profile;

  author = firstname && lastname ? `${firstname} ${lastname}` : user.username;
  const newBlogpost = new Blog({
    ...body,
    _id: blogpostId,
    author,
    user: user._id,
  });

  user.blogposts.push(blogpostId);

  await user.save();
  const blogpost = await newBlogpost.save();

  res.status(201).json({
    success: true,
    data: blogpost,
  });
};

const getBlogposts = async (req, res) => {
  const queries = req.query;

  const { page, limit, sort } = queries;

  const blogposts = await Blog.find()
    .populate("likes")
    .populate("comments")
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort({ createdAt: sort || -1 })
    .exec();

  res.json({
    success: true,
    data: blogposts,
  });
};

const getUserBlogposts = async (req, res) => {
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
      path: "blogposts",
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
    data: req.user.blogposts,
  });
};

const editBlogpost = async (req, res) => {
  const blogId = req.params.id;
  const user = req.user;
  const updates = _.pick(req.body, ["title", "body"]);

  const blog = await Blog.findOneAndUpdate(
    { _id: blogId, user: user._id },
    { $set: updates }
  );

  if (!blog) throw new AppError("Post does not exist", 404);

  res.json({
    success: true,
    data: blog,
  });
};

const getBlogpost = async (req, res) => {
  const blogpostId = req.params.id;
  const blogpost = await Blog.findOne({ _id: blogpostId })
    .populate("likes")
    .populate("comments");

  if (!blogpost) throw new AppError("Post not found", 404);

  res.json({
    success: true,
    data: blogpost,
  });
};

const getUserBlogpost = async (req, res) => {
  const blogpostId = req.params.id;
  const user = req.user;

  const blogpost = await Blog.findOne({ _id: blogpostId, user: user._id })
    .populate("likes")
    .populate("comments");

  if (!blogpost) throw new AppError("Post not found", 404);

  res.json({
    success: true,
    data: blogpost,
  });
};

const deleteBlogpost = async (req, res) => {
  const user = req.user;
  const blogId = req.params.id;
  const blog = await Blog.findOneAndDelete({ _id: blogId, user: user._id });

  if (!blog) throw new AppError("Blog does not exist", 404);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
};

const likeBlogpost = async (req, res) => {
  const blogpostId = req.params.id;
  const user = req.user;

  const hasLiked = await Blog.findOne({
    _id: blogpostId,
    "likes.authorId": user._id,
  });

  if (hasLiked)
    res
      .status(400)
      .json({ success: false, message: "User has already liked this post" });

  const blog = await Blog.findOneAndUpdate(
    { _id: blogpostId },
    {
      $push: {
        likes: {
          authorId: user._id,
          author: user.username,
        },
      },
    }
  );

  if (!blog) throw new AppError("Post does not exist", 404);

  user.likedBlogposts.push(blogpostId);

  await user.save();

  res.json({
    success: true,
    message: "Liked successfully",
  });
};

const commentOnBlogpost = async (req, res) => {
  const blogpostId = req.params.id;
  const body = _.pick(req.body, ["id", "text"]);
  const user = req.user;

  const { text } = body;

  if (!text) throw new AppError("Text is required", 400);

  const blog = await Blog.findOneAndUpdate(
    { _id: blogpostId },
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

  if (!blog) throw new AppError("Post does not exist", 404);

  user.blogComments.push(blogpostId);

  await user.save();

  res.json({
    success: true,
    message: "Comment posted successfully",
  });
};

module.exports = {
  postBlogpost,
  getBlogposts,
  getBlogpost,
  editBlogpost,
  deleteBlogpost,
  getUserBlogpost,
  getUserBlogposts,
  likeBlogpost,
  commentOnBlogpost,
};

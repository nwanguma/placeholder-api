const mongoose = require("mongoose");
const _ = require("lodash");

const { Schema, model } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  body: {
    type: String,
    required: [true, "Body is required"],
  },
  user: { ref: "user", type: mongoose.Schema.Types.ObjectId },
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
  author: String,
});

blogSchema.methods.toJSON = function () {
  const blog = this;
  const blogObject = blog.toObject();

  const body = _.pick(blogObject, [
    "title",
    "body",
    "createdAt",
    "updatedAt",
    "likes",
    "comments",
    "author",
    "_id",
  ]);

  return body;
};

const Blog = model("Blog", blogSchema);

module.exports = Blog;

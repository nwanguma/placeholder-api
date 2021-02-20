const mongoose = require("mongoose");
const _ = require("lodash");

const { Schema, model } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: [String, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  makers: [
    {
      firstname: String,
      lastname: String,
      email: String,
      twitterUrl: String,
      linkedinUrl: String,
    },
  ],
  poster: {
    firstname: String,
    lastname: String,
    email: String,
    twitterUrl: String,
    linkedinUrl: String,
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

productSchema.methods.toJSON = function () {
  const product = this;
  const productObject = product.toObject();

  const body = _.pick(productObject, [
    "title",
    "description",
    "_id",
    "makers",
    "poster",
    "comments",
    "likes",
    "createdAt",
  ]);

  return body;
};

const Product = model("Product", productSchema);

module.exports = Product;

const Product = require("../models/product.js");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const AppError = require("../utils/AppError.js");

const postProduct = async (req, res) => {
  const user = req.user;
  const body = _.pick(req.body, ["title", "description", "makers", "poster"]);
  const productId = new ObjectID();

  await user.populate("profile");
  const { firstname, lastname } = user.profile;

  author = firstname && lastname ? `${firstname} ${lastname}` : user.username;
  const newProduct = new Product({
    ...body,
    _id: productId,
    user: user._id,
  });

  user.products.push(productId);

  await user.save();
  const product = await newProduct.save();

  res.status(201).json({
    success: true,
    data: product,
  });
};

const getProducts = async (req, res) => {
  const queries = req.query;

  const { page, limit, sort } = queries;

  const products = await Product.find()
    .populate("likes")
    .populate("comments")
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort({ createdAt: sort || -1 })
    .exec();

  res.json({
    success: true,
    data: products,
  });
};

const getUserProducts = async (req, res) => {
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
      path: "products",
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
    data: req.user.products,
  });
};

const editProduct = async (req, res) => {
  const productId = req.params.id;
  const user = req.user;
  const updates = _.pick(req.body, [
    "title",
    "description",
    "makers",
    "poster",
  ]);

  const product = await Product.findOneAndUpdate(
    { _id: productId, user: user._id },
    { $set: updates }
  );

  if (!product) throw new AppError("Product does not exist", 404);

  res.json({
    success: true,
    data: product,
  });
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId })
    .populate("likes")
    .populate("comments");

  if (!product) throw new AppError("Product not found", 404);

  res.json({
    success: true,
    data: product,
  });
};

const getUserProduct = async (req, res) => {
  const productId = req.params.id;
  const user = req.user;

  const product = await Product.findOne({ _id: productId, user: user._id })
    .populate("likes")
    .populate("comments");

  if (!product) throw new AppError("Product not found", 404);

  res.json({
    success: true,
    data: product,
  });
};

const deleteProduct = async (req, res) => {
  const user = req.user;
  const productId = req.params.id;
  const product = await Product.findOneAndDelete({
    _id: productId,
    user: user._id,
  });

  if (!product) throw new AppError("Product does not exist", 404);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
};

const likeProduct = async (req, res) => {
  const productId = req.params.id;
  const user = req.user;

  const hasLiked = await Product.findOne({
    _id: productId,
    "likes.authorId": user._id,
  });

  if (hasLiked)
    res
      .status(400)
      .json({ success: false, message: "User has already liked this product" });

  const product = await Product.findOneAndUpdate(
    { _id: productId },
    {
      $push: {
        likes: {
          authorId: user._id,
          author: user.username,
        },
      },
    }
  );

  if (!product) throw new AppError("Product does not exist", 404);

  user.likedProducts.push(productId);

  await user.save();

  res.json({
    success: true,
    message: "Liked successfully",
  });
};

const commentOnProduct = async (req, res) => {
  const productId = req.params.id;
  const body = _.pick(req.body, ["id", "text"]);
  const user = req.user;

  const { text } = body;

  if (!text) throw new AppError("Text is required", 400);

  const product = await Product.findOneAndUpdate(
    { _id: productId },
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

  if (!product) throw new AppError("Product does not exist", 404);

  user.productComments.push(productId);

  await user.save();

  res.json({
    success: true,
    message: "Comment posted successfully",
  });
};

module.exports = {
  postProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getUserProduct,
  getUserProducts,
  likeProduct,
  commentOnProduct,
};

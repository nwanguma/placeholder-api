const express = require("express");
const {
  postBlogpost,
  deleteBlogpost,
  getBlogposts,
  getBlogpost,
  getUserBlogpost,
  getUserBlogposts,
  editBlogpost,
  likeBlogpost,
  commentOnBlogpost,
} = require("../controllers/blog.js");
const authenticate = require("../middlewares/auth.js");
const { blogValidation } = require("../middlewares/validation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

router
  .route("/")
  .post(authenticate, blogValidation, catchAsync(postBlogpost))
  .get(authenticate, catchAsync(getUserBlogposts));

router.route("/like/:id").post(authenticate, catchAsync(likeBlogpost));

router.route("/comment/:id").post(authenticate, catchAsync(commentOnBlogpost));

router.route("/all").get(authenticate, catchAsync(getBlogposts));
router.route("/all/:id").get(authenticate, catchAsync(getBlogpost));

router
  .route("/:id")
  .put(authenticate, blogValidation, catchAsync(editBlogpost))
  .delete(authenticate, catchAsync(deleteBlogpost))
  .get(authenticate, catchAsync(getUserBlogpost));

module.exports = router;

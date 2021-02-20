const express = require("express");
const {
  postJob,
  getJobposts,
  getJobpost,
  editJobpost,
  deleteJobpost,
  getUserJobpost,
  getUserJobposts,
  likeJobpost,
  commentOnJobpost,
} = require("../controllers/jobs");
const authenticate = require("../middlewares/auth.js");
const { jobValidation } = require("../middlewares/validation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

router
  .route("/")
  .post(authenticate, jobValidation, catchAsync(postJob))
  .get(authenticate, catchAsync(getUserJobposts));

router.route("/like/:id").post(authenticate, catchAsync(likeJobpost));

router.route("/comment/:id").post(authenticate, catchAsync(commentOnJobpost));

router.route("/all").get(authenticate, catchAsync(getJobposts));
router.route("/all/:id").get(authenticate, catchAsync(getJobpost));

router
  .route("/:id")
  .put(authenticate, jobValidation, catchAsync(editJobpost))
  .delete(authenticate, catchAsync(deleteJobpost))
  .get(authenticate, catchAsync(getUserJobpost));

module.exports = router;

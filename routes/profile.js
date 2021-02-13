const express = require("express");
const {
  getProfile,
  createProfile,
  editProfile,
} = require("../controllers/profile.js");
const authenticate = require("../middlewares/auth.js");
const catchAsync = require("../util/catchAsync.js");

const router = express.Router();

router
  .route("/")
  .get(authenticate, catchAsync(getProfile))
  .post(authenticate, catchAsync(createProfile))
  .patch(authenticate, catchAsync(editProfile));

module.exports = router;

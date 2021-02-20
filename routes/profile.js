const express = require("express");
const {
  getProfile,
  createProfile,
  editProfile,
} = require("../controllers/profile.js");
const authenticate = require("../middlewares/auth.js");
const { profileValidation } = require("../middlewares/validation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

router
  .route("/")
  .get(authenticate, catchAsync(getProfile))
  .post(authenticate, profileValidation, catchAsync(createProfile))
  .put(authenticate, profileValidation, catchAsync(editProfile));

module.exports = router;

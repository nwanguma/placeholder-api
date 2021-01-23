const express = require("express");
const {
  getProfile,
  createProfile,
  editProfile,
} = require("../controllers/profile.js");
const authenticate = require("../middlewares/auth.js");

const router = express.Router();

router
  .route("/")
  .get(authenticate, getProfile)
  .post(authenticate, createProfile)
  .patch(authenticate, editProfile);

module.exports = router;

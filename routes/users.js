const express = require("express");
const {
  createUser,
  loginUser,
  changeUserPassword,
  getUser,
} = require("../controllers/users.js");
const authenticate = require("../middlewares/auth");
const catchAsync = require("../util/catchAsync.js");
const userValidation = require("../middlewares/userInputValidation.js");

const router = express.Router();

router.route("/").post(createUser);

router.post("/register", userValidation, catchAsync(createUser));
router.post("/login", catchAsync(loginUser));
router.patch("/password", authenticate, changeUserPassword);
router.get("/me", authenticate, catchAsync(getUser));

module.exports = router;

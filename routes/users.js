const express = require("express");
const {
  createUser,
  loginUser,
  changeUserPassword,
} = require("../controllers/users.js");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(createUser);

router.post("/register", createUser);
router.post("/login", loginUser);
router.patch("/password", authenticate, changeUserPassword);

module.exports = router;

const express = require("express");
const { createUser, loginUser } = require("../controllers/users.js");

const router = express.Router();

router.route("/").post(createUser);

router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const { createChallenge } = require("../controllers/challenges.js");

const router = express.Router();

router.route("/").post(createChallenge);

module.exports = router;

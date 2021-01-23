const express = require("express");
const { createBounty } = require("../controllers/bounties.js");
const authenticate = require("../middlewares/auth.js");

const router = express.Router();

router.route("/").post(authenticate, createBounty);

module.exports = router;

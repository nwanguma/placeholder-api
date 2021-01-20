const express = require("express");
const { createBounty } = require("../controllers/bounties.js");

const router = express.Router();

router.route("/").post(createBounty);

module.exports = router;

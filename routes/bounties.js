const express = require("express");
const {
  createBounty,
  getUserBounties,
  getUserBounty,
  editBounty,
  deleteBounty,
  getAllBounties,
  getBounty,
} = require("../controllers/bounties.js");
const {
  getUserCompletedBounties,
  getUserCompletedBounty,
  createdCompletedBounty,
} = require("../controllers/completedBounties.js");
const authenticate = require("../middlewares/auth.js");

const router = express.Router();

//create bounty, list all created bounties
router
  .route("/")
  .post(authenticate, createBounty)
  .get(authenticate, getUserBounties);

//Get a user's completed challenges
router.route("/complete").get(authenticate, getUserCompletedBounties);

router.route("/all").get(authenticate, getAllBounties);
router.route("/all/:id").get(authenticate, getBounty);

//edit specific challenge, delete specific challenge, list specific challenge
router
  .route("/:id")
  .patch(authenticate, editBounty)
  .delete(authenticate, deleteBounty)
  .get(authenticate, getUserBounty);

//get single completed challenge
router
  .route("/complete/:id")
  .get(authenticate, getUserCompletedBounty)
  .post(authenticate, createdCompletedBounty);

module.exports = router;

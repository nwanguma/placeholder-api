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
const bountyValidation = require("../middlewares/bountyValidation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

//create bounty, list all created bounties
router
  .route("/")
  .post(authenticate, bountyValidation, catchAsync(createBounty))
  .get(authenticate, catchAsync(getUserBounties));

//Get a user's completed challenges
router
  .route("/complete")
  .get(authenticate, catchAsync(getUserCompletedBounties));

router.route("/all").get(authenticate, catchAsync(getAllBounties));
router.route("/all/:id").get(authenticate, catchAsync(getBounty));

//edit specific challenge, delete specific challenge, list specific challenge
router
  .route("/:id")
  .patch(authenticate, catchAsync(editBounty))
  .delete(authenticate, catchAsync(deleteBounty))
  .get(authenticate, catchAsync(getUserBounty));

//get single completed challenge
router
  .route("/complete/:id")
  .get(authenticate, catchAsync(getUserCompletedBounty))
  .post(authenticate, catchAsync(createdCompletedBounty));

module.exports = router;

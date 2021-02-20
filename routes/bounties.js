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
  editCompletedBounty,
  deleteCompletedBounty,
  getCompletedBountiesByBounty,
  getCompletedBounty,
} = require("../controllers/completedBounties.js");
const authenticate = require("../middlewares/auth.js");
const {
  bountyValidation,
  completedBountyValidation,
} = require("../middlewares/validation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

//create bounty, list all created bounties
router
  .route("/")
  .post(authenticate, bountyValidation, catchAsync(createBounty))
  .get(authenticate, catchAsync(getUserBounties));

//Get a user's completed bounties
router
  .route("/complete")
  .get(authenticate, catchAsync(getUserCompletedBounties));

router.route("/all").get(authenticate, catchAsync(getAllBounties));
router.route("/all/:id").get(authenticate, catchAsync(getBounty));

//edit specific bounty, delete specific bounty, list specific bounty
router
  .route("/:id")
  .patch(authenticate, catchAsync(editBounty))
  .delete(authenticate, catchAsync(deleteBounty))
  .get(authenticate, catchAsync(getUserBounty));

//get completed bounties by bounty id
router
  .route("/complete/all/:id")
  .get(authenticate, catchAsync(getCompletedBountiesByBounty));

//get single completed bounty by it's id for all authorized users
router
  .route("/complete/bounty/:id")
  .get(authenticate, catchAsync(getCompletedBounty));

//get single completed bounty
router
  .route("/complete/:id")
  .get(authenticate, catchAsync(getUserCompletedBounty))
  .post(authenticate, catchAsync(createdCompletedBounty))
  .put(authenticate, completedBountyValidation, catchAsync(editCompletedBounty))
  .delete(authenticate, catchAsync(deleteCompletedBounty));

module.exports = router;

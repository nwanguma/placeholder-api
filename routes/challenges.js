const express = require("express");
const {
  createChallenge,
  getUserChallenges,
  getUserChallenge,
  editChallenge,
  deleteChallenge,
  getAllChallenges,
  getChallenge,
} = require("../controllers/challenges.js");
const {
  getUserCompletedChallenges,
  getUserCompletedChallenge,
  createCompletedChallenge,
  editCompletedChallenge,
  deleteCompletedChallenge,
  getCompletedChallenge,
  getCompletedChallengesByChallenge,
} = require("../controllers/completedChallenges.js");
const authenticate = require("../middlewares/auth.js");
const challengeValidation = require("../middlewares/challengeValidation.js");
const completedChallengeValidation = require("../middlewares/completedChallengeValidation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

//create challenge, list all created challenges
router
  .route("/")
  .post(authenticate, challengeValidation, catchAsync(createChallenge))
  .get(authenticate, catchAsync(getUserChallenges));

//Get a user's completed challenges
router
  .route("/complete")
  .get(authenticate, catchAsync(getUserCompletedChallenges));

router.route("/all").get(authenticate, catchAsync(getAllChallenges));
router.route("/all/:id").get(authenticate, catchAsync(getChallenge));

//edit specific challenge, delete specific challenge, list specific challenge
router
  .route("/:id")
  .put(authenticate, challengeValidation, catchAsync(editChallenge))
  .delete(authenticate, catchAsync(deleteChallenge))
  .get(authenticate, catchAsync(getUserChallenge));

//get completed challenges by challenge id
router
  .route("/complete/all/:id")
  .get(authenticate, catchAsync(getCompletedChallengesByChallenge));

//get single completed challenge by it's id for all authorized users
router
  .route("/complete/challenge/:id")
  .get(authenticate, catchAsync(getCompletedChallenge));

//get single completed challenge
router
  .route("/complete/:id")
  .get(authenticate, catchAsync(getUserCompletedChallenge))
  .post(authenticate, catchAsync(createCompletedChallenge))
  .put(
    authenticate,
    completedChallengeValidation,
    catchAsync(editCompletedChallenge)
  )
  .delete(authenticate, catchAsync(deleteCompletedChallenge));

module.exports = router;

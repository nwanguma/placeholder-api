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
} = require("../controllers/completedChallenges.js");
const authenticate = require("../middlewares/auth.js");

const router = express.Router();

//create challenge, list all created challenges
router
  .route("/")
  .post(authenticate, createChallenge)
  .get(authenticate, getUserChallenges);

//Get a user's completed challenges
router.route("/complete").get(authenticate, getUserCompletedChallenges);

router.route("/all").get(authenticate, getAllChallenges);
router.route("/all/:id").get(authenticate, getChallenge);

//edit specific challenge, delete specific challenge, list specific challenge
router
  .route("/:id")
  .patch(authenticate, editChallenge)
  .delete(authenticate, deleteChallenge)
  .get(authenticate, getUserChallenge);

//get single completed challenge
router
  .route("/complete/:id")
  .get(authenticate, getUserCompletedChallenge)
  .post(authenticate, createCompletedChallenge);

module.exports = router;

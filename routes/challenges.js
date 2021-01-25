const express = require("express");
const {
  createChallenge,
  getChallenges,
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
  .get(authenticate, getChallenges);

router.route("/all").get(authenticate, getAllChallenges);

//edit specific challenge, delete specific challenge, list specific challenge
router
  .route("/:id")
  .patch(authenticate, editChallenge)
  .delete(authenticate, deleteChallenge)
  .get(authenticate, getChallenge);

//Get a user's completed challenges
router.route("/complete").get(authenticate, getUserCompletedChallenges);

//get single completed challenge
router
  .route("/complete/:id")
  .get(authenticate, getUserCompletedChallenge)
  .post(authenticate, createCompletedChallenge);

module.exports = router;

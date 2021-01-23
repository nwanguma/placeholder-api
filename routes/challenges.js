const express = require("express");
const {
  createChallenge,
  getChallenges,
  editChallenge,
  deleteChallenge,
  getAllChallenges,
} = require("../controllers/challenges.js");
const authenticate = require("../middlewares/auth.js");

const router = express.Router();

router
  .route("/")
  .post(authenticate, createChallenge)
  .get(authenticate, getChallenges);

router
  .route("/:id")
  .patch(authenticate, editChallenge)
  .delete(authenticate, deleteChallenge);

router.get("/all", authenticate, getAllChallenges);

module.exports = router;

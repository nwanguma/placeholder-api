const express = require("express");
const {
  createBounty,
  getBounties,
  editBounty,
  deleteBounty,
  getAllBounties,
} = require("../controllers/Bounties.js");
const authenticate = require("../middlewares/auth.js");

const router = express.Router();

router
  .route("/")
  .post(authenticate, createBounty)
  .get(authenticate, getBounties);

router
  .route("/:id")
  .patch(authenticate, editBounty)
  .delete(authenticate, deleteBounty);

router.get("/all", authenticate, getAllBounties);

module.exports = router;

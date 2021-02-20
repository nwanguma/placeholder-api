const express = require("express");
const {
  postProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getUserProduct,
  getUserProducts,
  likeProduct,
  commentOnProduct,
} = require("../controllers/products.js");
const authenticate = require("../middlewares/auth.js");
const { productValidation } = require("../middlewares/validation.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

router
  .route("/")
  .post(authenticate, productValidation, catchAsync(postProduct))
  .get(authenticate, catchAsync(getUserProducts));

router.route("/like/:id").post(authenticate, catchAsync(likeProduct));

router.route("/comment/:id").post(authenticate, catchAsync(commentOnProduct));

router.route("/all").get(authenticate, catchAsync(getProducts));
router.route("/all/:id").get(authenticate, catchAsync(getProduct));

router
  .route("/:id")
  .put(authenticate, productValidation, catchAsync(editProduct))
  .delete(authenticate, catchAsync(deleteProduct))
  .get(authenticate, catchAsync(getUserProduct));

module.exports = router;

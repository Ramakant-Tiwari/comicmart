const express = require("express");
const {
  addCartItem,
  getCart,
  updateCartItem,
} = require("../controllers/cartController");

const router = express.Router();

router.route("/").get(getCart);
router.route("/items").post(addCartItem).patch(updateCartItem);

module.exports = router;

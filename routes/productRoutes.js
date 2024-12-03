const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.route("/products").get(productController.getAllProduct);
router.route("/product/:id").get(productController.getProduct);

module.exports = router;

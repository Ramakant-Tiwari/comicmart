const express = require("express");

const adminController = require("../controllers/adminController");
const configuredMulterMiddleware = require("../middlewares/image-upload");

const router = express.Router();

router
  .route("/products")
  .get(adminController.getProducts)
  .post(configuredMulterMiddleware, adminController.createNewProduct);

router.route("/products/new").get(adminController.getNewProduct);
router
  .route("/orders")
  .get(adminController.getOrders)
  .post(adminController.updateOrders);

router
  .route("/product/:id")
  .get(adminController.getUpdateProduct)
  .post(configuredMulterMiddleware, adminController.postUpdateProduct);

router.post("/product/:id/delete", adminController.deleteProduct);

module.exports = router;

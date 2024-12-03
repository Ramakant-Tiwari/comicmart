const express = require("express");
const { addOrder, getOrders, updateOrders } = require("../controllers/orderController");

const router = express.Router();

router.route("/").get(getOrders).post(addOrder);

module.exports = router;

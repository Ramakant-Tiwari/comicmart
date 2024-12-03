const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/signup")
  .get(authController.getSignup)
  .post(authController.signup);

router.route("/login").get(authController.getLogin).post(authController.login);
router.route("/logout").post(authController.logout);

module.exports = router;

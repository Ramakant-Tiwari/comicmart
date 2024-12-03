const express = require("express");

const router = express.Router();

router.route("/").get((req, res) => res.redirect("/products"));
router.route("/401").get((req, res) => res.status(401).render("shared/401"));
router.route("/403").get((req, res) => res.status(403).render("shared/403"));

module.exports = router;

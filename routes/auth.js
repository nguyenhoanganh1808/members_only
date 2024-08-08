const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userControllers");

router.get("/log-in", userController.login_get);

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/clubhouse/log-in",
  })
);

router.get("/sign-up", userController.signup_get);

router.post("/sign-up", userController.signup_post);

router.get("/log-out", userController.logout_get);

router.get("/join-membership", userController.join_membership_get);

router.post("/join-membership", userController.join_membership_post);

module.exports = router;

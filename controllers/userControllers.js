const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("../db/queries");
require("dotenv").config();

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstname")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`)
    .escape(),
  body("lastname")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`)
    .escape(),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not empty")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not empty")
    .isEmail()
    .withMessage("Enter a valid email")
    .escape(),
];

exports.login_get = asyncHandler(async (req, res) => {
  res.render("login_form");
});

exports.signup_get = asyncHandler(async (req, res) => {
  res.render("sign_up_form", { title: "Sign up" });
});

exports.logout_get = asyncHandler(async (req, res) => {
  res.locals.user = null;
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });

  res.redirect("/clubhouse/log-in");
});

exports.signup_post = [
  validateUser,
  body("email")
    .trim()
    .custom(async (value) => {
      const user = await db.getUserByEmail(value);
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
  body("username")
    .trim()
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password", "Password must contain at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("confirmpassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Confirm password must equal to password")
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin === "on" ? true : false,
      confirmpassword: req.body.confirmpassword,
    };

    if (!errors.isEmpty()) {
      return res.status(400).render("sign_up_form", {
        title: "Signup",
        errors: errors.array(),
        user: user,
      });
    }

    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      if (err) {
        return next(err);
      }

      await db.insertUser(user, hash);
    });
    res.redirect("/clubhouse/log-in");
  }),
];

exports.join_membership_get = asyncHandler((req, res) => {
  res.render("join_membership_form");
});

exports.join_membership_post = [
  body("passcode")
    .trim()
    .custom((value) => value === process.env.SECRET_CODE)
    .withMessage("Secret code INCORRECT")
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("join_membership_form", {
        errors: errors.array(),
      });
    }
    await db.updateMembershipStatus(res.locals.user.id, true);
    res.redirect("/");
  }),
];

exports.join_admin_get = asyncHandler((req, res) => {
  res.render("join_admin_form");
});

exports.join_admin_post = asyncHandler((req, res) => {
  res.render("join_admin_form");
});

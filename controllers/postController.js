const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.posts_list_get = asyncHandler(async (req, res) => {
  const postsList = await db.getAllPosts();
  console.log("postList " + postsList);
  res.render("index", { postsList: postsList, currentUser: res.locals.user });
});

exports.new_post_get = asyncHandler(async (req, res) => {
  res.render("new_post_form");
});

exports.new_post_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must not empty.")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must not empty.")
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const post = {
      title: req.body.title,
      content: req.body.content,
    };

    if (!errors.isEmpty()) {
      return res.send(400).render("new_post_form", { errors: errors.array() });
    }

    await db.insertPost(post, res.locals.user.id);
    res.redirect("/");
  }),
];

exports.delete_post_post = asyncHandler(async (req, res) => {
  await db.deletePostById(req.params.id);
  res.redirect("/");
});

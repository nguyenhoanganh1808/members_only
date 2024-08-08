const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.posts_list_get);

router.get("/new", postController.new_post_get);

router.post("/new", postController.new_post_post);

router.post("/:id/delete", postController.delete_post_post);

module.exports = router;

const express = require("express");
const router = express.Router();

const { createPost, getPost, getAllPosts, updatePost, deletePost } = require("../controllers/post");

const { isAuth } = require("../middleware/auth");

// Create Post
router.post("/posts", isAuth, createPost);

// Get All Posts
router.get("/posts", isAuth, getAllPosts);

// Get Post By Id
router.get("/posts/:postId", getPost);

// Update Post By Id
router.put("/posts/:postId", isAuth, updatePost);

// Delete Post By Id
router.delete("/posts/:postId", isAuth, deletePost);

module.exports = router;

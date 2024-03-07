const express = require("express");
const router = express.Router();

const { createPost, getPost, getAllPosts, updatePost, deletePost } = require("../controllers/post");

const { isAuth } = require("../middleware/auth");

// Create Post - POST: /posts
router.post("/posts", isAuth, createPost);

// Get Posts - GET: /posts
router.get("/posts", isAuth, getAllPosts);

// Get Post By Id - GET: /posts/:postId
router.get("/posts/:postId", getPost);

// Update Post By Id - PUT: /posts/:postId
router.put("/posts/:postId", isAuth, updatePost);

// Delete Post By Id - DELETE /posts/:postId
router.delete("/posts/:postId", isAuth, deletePost);

module.exports = router;

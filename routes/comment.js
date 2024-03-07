const express = require("express");
const router = express.Router();

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment");

const { isAuth } = require("../middleware/auth");

// Get Comments for specific post - GET: posts/:postId/comments
router.get("/posts/:postId/comments", isAuth, getComments);

// Create comment for specific post - POST: /posts/:postId/comments
router.post("/posts/:postId/comments", isAuth, createComment);

// Update comments on a specific post - PUT: /posts/:postId/comments/:commentId
router.put("/posts/:postId/comments/:commentId", isAuth, updateComment);

// Delete comment on a specific post - DELETE: /posts/:postId/comments/:commentId
router.delete("/posts/:postId/comments/:commentId", isAuth, deleteComment);

module.exports = router;

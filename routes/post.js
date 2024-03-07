const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");
const { isAuth } = require("../middleware/auth");
const mongoose = require("mongoose");

// Create Post - POST: /posts
router.post("/posts", isAuth, async (req, res) => {
  const { title, content, author } = req.body;

  try {
    // Create a post object
    let post = new Post({
      title,
      content,
      author,
    });

    await post.save();

    res.status(200).json({ msg: "Post Created Successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get Posts - GET: /posts
router.get("/posts", isAuth, async (req, res) => {
  try {
    const posts = await Post.find();

    // Check for existing posts
    if (posts === null || (Array.isArray(posts) && posts.length === 0)) {
      return res.status(400).json({ msg: "There are no posts" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Get Post By Id - GET: /posts/:postId
router.get("/posts/:postId", isAuth, async (req, res) => {
  // Get postId from params
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    // check if post is returned
    if (post === null || (Array.isArray(post) && post.length === 0)) {
      return res.status(400).json({ msg: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Update Post By Id - PUT: /posts/:postId
router.put("/posts/:postId", isAuth, async (req, res) => {
  // get postId and form input from request
  const postId = req.params.postId;
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });

    // check if post is returned
    if (updatedPost === null || (Array.isArray(updatedPost) && updatedPost.length === 0)) {
      return res.status(400).json({ msg: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Delete Post By Id - DELETE /posts/:postId
router.delete("/posts/:postId", isAuth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    // check if post is returned
    if (post === null || (Array.isArray(post) && post.length === 0)) {
      return res.status(400).json({ msg: "Post not found" });
    }

    // Delete post from db
    await Post.deleteOne({ _id: postId });

    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get Comments for specific post - GET: posts/:postId/comments
router.get("/posts/:postId/comments", isAuth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    // Check if post exists
    if (post === null || (Array.isArray(post) && post.length === 0)) {
      return res.status(400).json({ msg: "Post not found" });
    }

    const comments = await Comment.find({ post: postId });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Create comment for specific post - POST: /posts/:postId/comments
router.post("/posts/:postId/comments", isAuth, async (req, res) => {
  const postId = req.params.postId;
  const { content, userId } = req.body;

  try {
    // check if post exists
    const post = await Post.findById(postId);

    if (post === null || (Array.isArray(post) && post.length === 0)) {
      return res.status(400).json({ msg: "Post not found" });
    }

    const newComment = new Comment({
      content,
      user: userId,
      post: postId,
    });

    await newComment.save();

    // Add comment to post comments array
    post.comments.push(newComment);
    await post.save();

    res.status(200).json({ msg: "Added Comment" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Update comments on a specific post - PUT: /posts/:postId/comments/:commentId
router.put("/posts/:postId/comments/:commentId", isAuth, async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  try {
    let comment = await Comment.findOne({ _id: commentId, post: postId });

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Update Comment
    comment.content = content;

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Delete comment on a specific post - DELETE: /posts/:postId/comments/:commentId
router.delete("/posts/:postId/comments/:commentId", isAuth, async (req, res) => {
  const { postId, commentId } = req.params;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Delete the comment from the Comment collection
      const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        post: postId,
      }).session(session);

      if (!deletedComment) {
        throw new Error("Comment not found");
      }

      // Remove the comment ID from the associated post's comments array
      await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } }).session(session);
    });

    res.status(200).json({ msg: "Comment Deleted" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ msg: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;

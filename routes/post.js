const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Create Post - POST: /posts
router.post("/posts", async (req, res) => {
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
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    // Check for existing posts
    if (posts.length == 0) {
      return res.status(400).json({ msg: "There are no posts" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Get Post By Id - GET: /posts/:postId
router.get("/posts/:postId", async (req, res) => {
  // Get postId from params
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    // check if post is returned
    if (post.length == 0) {
      return res.status(400).json({ msg: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Update Post By Id - PUT: /posts/:postId
router.put("/posts/:postId", async (req, res) => {
  // get postId and form input from request
  const postId = req.params.postId;
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });

    // check if post is returned
    if (updatedPost.length == 0) {
      return res.status(400).json({ msg: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Delete Post By Id - DELETE /posts/:postId
router.delete("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    // check if post is returned
    if (post.length == 0) {
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

// Create comment for specific post - POST: /posts/:postId/comments

// Update comments on a specific post - PUT: /posts/:postId/comments/:commentId

// Delete comment on a specific post - DELETE: /posts/:postId/comments/:commentId

module.exports = router;

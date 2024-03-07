const Post = require("../models/post");

exports.createPost = async (req, res) => {
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
};

exports.getPost = async (req, res) => {
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
};

exports.getAllPosts = async (req, res) => {
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
};

exports.updatePost = async (req, res) => {
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
};

exports.deletePost = async (req, res) => {
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
};

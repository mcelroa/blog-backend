const Comment = require("../models/comment");
const Post = require("../models/post");
const mongoose = require("mongoose");

exports.createComment = async (req, res) => {
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
};

exports.getComments = async (req, res) => {
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
};

exports.updateComment = async (req, res) => {
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
};

exports.deleteComment = async (req, res) => {
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
};

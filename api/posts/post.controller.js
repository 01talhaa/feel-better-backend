const Post = require('./post.model');
const Comment = require('../comments/comment.model'); // For creating comments

exports.createPost = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
};
exports.getAllPosts = async (req, res) => { /* ... similar to user controller ... */ };
exports.getPostById = async (req, res) => { /* ... similar to user controller ... */ };

// Controller for nested resources (Comments)
exports.getCommentsForPost = async (req, res) => {
    try {
        const comments = await Post.findCommentsByPostId(req.params.postId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};

exports.createCommentForPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const newComment = await Comment.create({ ...req.body, post_id: postId });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Error creating comment", error: error.message });
    }
};

// Controller for Likes
exports.likePost = async (req, res) => {
    try {
        // Check if userId exists in the body
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ 
                message: "Missing required field: userId",
                example: { userId: 1 }
            });
        }
        
        // Make sure postId is valid
        const postId = req.params.postId;
        if (!postId) {
            return res.status(400).json({ message: "Missing post ID in URL" });
        }
        
        const affectedRows = await Post.addLike(postId, userId);
        if (affectedRows === 0) return res.status(404).json({ message: "Post not found" });
        res.status(201).json({ message: "Post liked" });
    } catch (error) {
        console.error("Error liking post:", error);
        // Handle unique constraint violation (already liked)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "You have already liked this post." });
        }
        res.status(500).json({ message: "Error liking post", error: error.message });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { userId } = req.body;
        const affectedRows = await Post.removeLike(req.params.postId, userId);
        if (affectedRows === 0) return res.status(404).json({ message: "Like not found or post not found" });
        res.status(200).json({ message: "Post unliked" });
    } catch (error) {
        res.status(500).json({ message: "Error unliking post", error: error.message });
    }
};
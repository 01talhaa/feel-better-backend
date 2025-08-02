const Comment = require('./comment.model');

// Get all comments - for admin purposes
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        // Add authorization here to ensure user owns comment
        const affectedRows = await Comment.delete(req.params.commentId);
        if (affectedRows === 0) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
};
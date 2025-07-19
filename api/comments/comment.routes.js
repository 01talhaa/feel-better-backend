const express = require('express');
const router = express.Router();
const controller = require('./comment.controller');

// This file is not directly used in server.js but shows the pattern.
// A more practical approach is to attach these routes where they make sense.
// For example, you might add this to the `posts.routes.js` file:
// router.delete('/:postId/comments/:commentId', commentController.deleteComment);

// However, for pure separation, you could have a top-level route.
// PUT /api/comments/123
// DELETE /api/comments/123
router.delete('/:commentId', controller.deleteComment);

// For this implementation, we will NOT add this router to server.js
// as comment creation/deletion is logically nested under posts.
module.exports = router;
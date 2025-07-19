const express = require('express');
const router = express.Router();
const controller = require('./post.controller');

// Main post routes
router.post('/', controller.createPost);
// router.get('/', controller.getAllPosts);
// router.get('/:postId', controller.getPostById);

// Nested routes for comments on a post
router.post('/:postId/comments', controller.createCommentForPost);
router.get('/:postId/comments', controller.getCommentsForPost);

// Nested routes for likes on a post
router.post('/:postId/like', controller.likePost);
router.delete('/:postId/like', controller.unlikePost);

module.exports = router;
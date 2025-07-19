const express = require('express');
const router = express.Router();
const controller = require('./group.controller');
const { protect } = require('../../api/middleware/auth.middleware');

// Group management
router.post('/', controller.createGroup);
router.get('/', controller.getAllPublicGroups);

// Membership management (for a specific group)
router.post('/:groupId/join', protect, controller.joinGroup);
router.delete('/:groupId/leave', protect, controller.leaveGroup);
router.get('/:groupId/members', controller.getGroupMembers);

// Content within a group
router.get('/:groupId/posts', controller.getPostsInGroup);

module.exports = router;
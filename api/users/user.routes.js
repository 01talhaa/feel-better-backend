// api/users/user.routes.js (CORRECTED)

const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { protect } = require('../middleware/auth.middleware');

// Root route to get all users
router.get('/', controller.getAllUsers);

// Public routes for authentication
router.post('/register', controller.createUser);
router.post('/login', controller.loginUser);
router.post('/anonymous', controller.loginAnonymous); // Add this line

// Protected route to get the logged-in user's profile
router.get('/profile', protect, controller.getUserProfile);

// You can add admin-only routes later if needed
// router.get('/', protect, adminMiddleware, controller.getAllUsers);

module.exports = router;
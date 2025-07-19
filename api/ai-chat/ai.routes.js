const express = require('express');
const router = express.Router();
const controller = require('./ai.controller');

// Start a new chat session for a user
router.post('/sessions', controller.startNewSession);

// Get all messages for a specific chat session
router.get('/sessions/:sessionId/messages', controller.getSessionMessages);

// Post a new message from a user to a session (which also triggers an AI response)
router.post('/sessions/:sessionId/messages', controller.postMessageToSession);

// Optional: Streaming endpoint
router.post('/sessions/:sessionId/stream', controller.postStreamingMessageToSession);

module.exports = router;
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Import feature routes
const userRoutes = require('./api/users/user.routes');
const therapistRoutes = require('./api/therapists/therapist.routes');
const appointmentRoutes = require('./api/appointments/appointment.routes'); 
const groupRoutes = require('./api/support-groups/group.routes');        
const postRoutes = require('./api/posts/post.routes');
const aiChatRoutes = require('./api/ai-chat/ai.routes');
const commentRoutes = require('./api/comments/comment.routes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Root route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Mental Health Platform API. Visit /api for available endpoints." });
});

// API Root
app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the Mental Health API. Grouping by features." });
});

// Use the routers for each feature
app.use('/api/users', userRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/support-groups', groupRoutes);  
app.use('/api/posts', postRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/comments', commentRoutes);      

// A simple error handler middleware
app.use((err, req, res, next) => {
    console.error('Error encountered:', err);
    res.status(500).json({
        message: "Something went wrong",
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

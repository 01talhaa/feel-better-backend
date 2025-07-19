// api/users/user.controller.js (CORRECTED)

const User = require('./user.model');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id, type) => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// This is the function for the POST /register route
exports.createUser = async (req, res) => {
    console.log('--- EXECUTING: createUser controller ---');
    console.log('Inspecting the imported User object:', User);
    try {
        const { user_type, full_name, email, password } = req.body;
        
        if (!email || !password || !full_name || !user_type) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        const newUser = await User.create({ user_type, full_name, email, password });
        
        res.status(201).json({
            ...newUser,
            token: generateToken(newUser.id, newUser.userType)
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// THIS IS THE FUNCTION THAT WAS MISSING FROM YOUR EXPORTS
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (user && (await User.matchPassword(password, user))) {
            res.json({
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                user_type: user.user_type,
                token: generateToken(user.user_id, user.user_type),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Anonymous login function
exports.loginAnonymous = async (req, res) => {
    try {
        // Check if an anonymous_id is provided for returning users
        const { anonymous_id } = req.body;
        
        if (anonymous_id) {
            // Try to find existing anonymous user
            const user = await User.findByAnonymousId(anonymous_id);
            
            if (user) {
                // Return existing user with new token
                return res.json({
                    user_id: user.user_id,
                    anonymous_id: user.anonymous_id,
                    user_type: user.user_type,
                    token: generateToken(user.user_id, user.user_type),
                });
            }
        }
        
        // Create new anonymous user if no ID provided or ID not found
        const newAnonymousUser = await User.createAnonymous();
        
        res.status(201).json({
            user_id: newAnonymousUser.id,
            anonymous_id: newAnonymousUser.anonymousId,
            user_type: 'ANONYMOUS',
            token: generateToken(newAnonymousUser.id, 'ANONYMOUS')
        });
    } catch (error) {
        console.error('Error in anonymous login:', error);
        res.status(500).json({ message: "Error with anonymous login", error: error.message });
    }
};

// Example protected route function
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
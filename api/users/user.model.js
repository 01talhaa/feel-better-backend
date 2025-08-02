console.log('--- LOADING: api/users/user.model.js ---'); 

const pool = require('../../config/db');
const bcrypt = require('bcryptjs');

// attaching functions directly to module.exports
// instead of creating a separate object first.


module.exports.create = async (user) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const sql = `INSERT INTO users (user_type, full_name, email, password_hash) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [user.user_type, user.full_name, user.email, hashedPassword]);
    return { id: result.insertId, email: user.email, fullName: user.full_name, userType: user.user_type };
};

module.exports.findByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

module.exports.matchPassword = async (enteredPassword, user) => {
    if (!user || !user.password_hash) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, user.password_hash);
};

module.exports.findById = async (id) => {
    const [rows] = await pool.query("SELECT user_id, user_type, full_name, email, created_at FROM users WHERE user_id = ?", [id]);
    return rows[0];
};

// Create an anonymous user
module.exports.createAnonymous = async () => {
    try {
        // Generate a unique anonymous ID
        const anonymousId = 'anon_' + Math.random().toString(36).substring(2, 15);
        // Create a random password for security
        const password = Math.random().toString(36).substring(2, 15);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Insert the anonymous user with ALL required fields
        const [result] = await pool.query(
            `INSERT INTO users (
                user_type, 
                anonymous_id, 
                password_hash,
                full_name,
                is_verified
            ) VALUES (?, ?, ?, ?, ?)`, 
            [
                'ANONYMOUS',
                anonymousId,
                hashedPassword,
                'Anonymous User',
                false
            ]
        );
        console.log(`Anonymous user created with ID: ${result.insertId}`);
        return { 
            id: result.insertId, 
            anonymousId: anonymousId,
            userType: 'ANONYMOUS'
        };
    } catch (error) {
        console.error('Error creating anonymous user:', error);
        console.error('Error details:', error.sqlMessage || error.message);
        throw error;
    }
};

// Find user by anonymous ID
module.exports.findByAnonymousId = async (anonymousId) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE anonymous_id = ?", 
        [anonymousId]
    );
    return rows[0];
};

// Find all users
module.exports.findAll = async () => {
    const [rows] = await pool.query("SELECT user_id, user_type, full_name, email, created_at FROM users");
    return rows;
};
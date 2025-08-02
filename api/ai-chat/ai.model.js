const pool = require('../../config/db');

const AiModel = {
    // Session Management
    async createSession(userId) {
        const sql = `INSERT INTO aichatsessions (user_id) VALUES (?)`;
        const [result] = await pool.query(sql, [userId]);
        return { session_id: result.insertId, user_id: userId };
    },

    async findSessionById(sessionId) {
        const [rows] = await pool.query("SELECT * FROM aichatsessions WHERE session_id = ?", [sessionId]);
        return rows[0];
    },

    // Message Management
    async addMessage(message) {
        const { session_id, sender, message_text } = message;
        const sql = `INSERT INTO aichatmessages (session_id, sender, message_text) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [session_id, sender, message_text]);
        return { message_id: result.insertId, ...message };
    },

    async findMessagesBySession(sessionId) {
        const sql = `SELECT * FROM aichatmessages WHERE session_id = ? ORDER BY timestamp ASC`;
        const [rows] = await pool.query(sql, [sessionId]);
        return rows;
    }
};

module.exports = AiModel;
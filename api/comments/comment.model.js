const pool = require('../../config/db');
const CommentModel = {
    async create(comment) {
        const sql = `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [comment.post_id, comment.user_id, comment.parent_comment_id, comment.content]);
        return { id: result.insertId, ...comment };
    },
    async findAll() {
        const sql = `
            SELECT c.*, p.title as post_title, u.full_name as author_name
            FROM comments c
            JOIN posts p ON c.post_id = p.post_id
            JOIN users u ON c.user_id = u.user_id
            ORDER BY c.created_at DESC`;
        const [rows] = await pool.query(sql);
        return rows;
    },
    async delete(id) {
        const [result] = await pool.query("DELETE FROM comments WHERE comment_id = ?", [id]);
        return result.affectedRows;
    }
};
module.exports = CommentModel;
const pool = require('../../config/db');
const CommentModel = {
    async create(comment) {
        const sql = `INSERT INTO Comments (post_id, user_id, parent_comment_id, content) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [comment.post_id, comment.user_id, comment.parent_comment_id, comment.content]);
        return { id: result.insertId, ...comment };
    },
    async delete(id) {
        const [result] = await pool.query("DELETE FROM Comments WHERE comment_id = ?", [id]);
        return result.affectedRows;
    }
};
module.exports = CommentModel;
const pool = require('../../config/db');
const PostModel = {
    async create(post) {
        const sql = `INSERT INTO posts (user_id, group_id, title, content, post_anonymously) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [post.user_id, post.group_id, post.title, post.content, post.post_anonymously]);
        return { id: result.insertId, ...post };
    },
    async findAll() {
        const [rows] = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
        return rows;
    },
    async findById(id) {
        const [rows] = await pool.query("SELECT * FROM posts WHERE post_id = ?", [id]);
        return rows[0];
    },
    async findCommentsByPostId(postId) {
        const [rows] = await pool.query("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC", [postId]);
        return rows;
    },
    async addLike(postId, userId) {
        const [result] = await pool.query("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [postId, userId]);
        return result.affectedRows;
    },
    async removeLike(postId, userId) {
        const [result] = await pool.query("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [postId, userId]);
        return result.affectedRows;
    }
};
module.exports = PostModel;
const pool = require('../../config/db');

const GroupModel = {
    async create(group) {
        const sql = `INSERT INTO supportgroups (group_name, description, is_private) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [group.group_name, group.description, group.is_private]);
        return { id: result.insertId, ...group };
    },
    
    async findAll() {
        const [rows] = await pool.query("SELECT * FROM supportgroups WHERE is_private = false");
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query("SELECT * FROM supportgroups WHERE group_id = ?", [id]);
        return rows[0]; // Return the first row or undefined if not found
    },

    // Junction table logic
    async addMember(groupId, userId) {
        const sql = `INSERT INTO user_supportgroup_membership (group_id, user_id) VALUES (?, ?)`;
        const [result] = await pool.query(sql, [groupId, userId]);
        return result.affectedRows;
    },

    async removeMember(groupId, userId) {
        const sql = `DELETE FROM user_supportgroup_membership WHERE group_id = ? AND user_id = ?`;
        const [result] = await pool.query(sql, [groupId, userId]);
        return result.affectedRows;
    },

    async findMembers(groupId) {
        // Using the correct table name from your schema
        const [rows] = await pool.query(`
            SELECT u.user_id, u.full_name, u.email, m.join_date
            FROM user_supportgroup_membership m
            JOIN users u ON m.user_id = u.user_id
            WHERE m.group_id = ?
            ORDER BY m.join_date DESC
        `, [groupId]);
        return rows;
    },

    async findPosts(groupId) {
        // Join with users table to get author information
        const [rows] = await pool.query(`
            SELECT p.post_id, p.content, p.created_at, 
                   u.user_id, u.full_name as author_name
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.user_id
            WHERE p.group_id = ?
            ORDER BY p.created_at DESC
        `, [groupId]);
        return rows;
    }
};

module.exports = GroupModel;
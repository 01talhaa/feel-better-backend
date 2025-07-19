const pool = require('../../config/db');

const GroupModel = {
    async create(group) {
        const sql = `INSERT INTO SupportGroups (group_name, description, is_private) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [group.group_name, group.description, group.is_private]);
        return { id: result.insertId, ...group };
    },
    
    async findAll() {
        const [rows] = await pool.query("SELECT * FROM SupportGroups WHERE is_private = false");
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query("SELECT * FROM SupportGroups WHERE group_id = ?", [id]);
        return rows[0]; // Return the first row or undefined if not found
    },

    // Junction table logic
    async addMember(groupId, userId) {
        const sql = `INSERT INTO User_SupportGroup_Membership (group_id, user_id) VALUES (?, ?)`;
        const [result] = await pool.query(sql, [groupId, userId]);
        return result.affectedRows;
    },

    async removeMember(groupId, userId) {
        const sql = `DELETE FROM User_SupportGroup_Membership WHERE group_id = ? AND user_id = ?`;
        const [result] = await pool.query(sql, [groupId, userId]);
        return result.affectedRows;
    },

    async findMembers(groupId) {
        // Using the correct table name from your schema
        const [rows] = await pool.query(`
            SELECT u.user_id, u.full_name, u.email, m.join_date
            FROM User_SupportGroup_Membership m
            JOIN Users u ON m.user_id = u.user_id
            WHERE m.group_id = ?
            ORDER BY m.join_date DESC
        `, [groupId]);
        return rows;
    },

    async findPosts(groupId) {
        // Join with Users table to get author information
        const [rows] = await pool.query(`
            SELECT p.post_id, p.content, p.created_at, 
                   u.user_id, u.full_name as author_name
            FROM Posts p
            LEFT JOIN Users u ON p.user_id = u.user_id
            WHERE p.group_id = ?
            ORDER BY p.created_at DESC
        `, [groupId]);
        return rows;
    }
};

module.exports = GroupModel;
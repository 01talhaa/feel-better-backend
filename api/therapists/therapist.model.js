const pool = require('../../config/db');
const TherapistModel = {
    async create(therapistData) {
        // This assumes user_id is provided and valid
        const sql = `INSERT INTO Therapists (user_id, specialization, license_number, bio, years_of_experience) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [
            therapistData.user_id,
            therapistData.specialization,
            therapistData.license_number,
            therapistData.bio,
            therapistData.years_of_experience
        ]);
        return { id: result.insertId, ...therapistData };
    },
    async findAll() {
        // Join with users table to get name and email
        const sql = `SELECT t.*, u.full_name, u.email FROM Therapists t JOIN Users u ON t.user_id = u.user_id`;
        const [rows] = await pool.query(sql);
        return rows;
    },
    async findByUserId(userId) {
        const sql = `SELECT t.*, u.full_name, u.email FROM Therapists t JOIN Users u ON t.user_id = u.user_id WHERE t.user_id = ?`;
        const [rows] = await pool.query(sql, [userId]);
        return rows[0];
    }
};
module.exports = TherapistModel;
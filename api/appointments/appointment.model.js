const pool = require('../../config/db');

const AppointmentModel = {
    async create(appt) {
        // Format appointment time to MySQL compatible format
        let appointmentTime = appt.appointment_time;
        if (appointmentTime && typeof appointmentTime === 'string') {
            try {
                // Convert ISO string to MySQL datetime format
                const date = new Date(appointmentTime);
                if (isNaN(date)) {
                    throw new Error('Invalid date format');
                }
                appointmentTime = date.toISOString().slice(0, 19).replace('T', ' ');
            } catch (error) {
                throw new Error(`Invalid appointment time format: ${appointmentTime}`);
            }
        }
        
        const sql = `INSERT INTO appointments (user_id, therapist_id, appointment_time, duration_minutes, status, meeting_link) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [
            appt.user_id,
            appt.therapist_id,
            appointmentTime,
            appt.duration_minutes,
            'SCHEDULED',
            appt.meeting_link
        ]);
        return { id: result.insertId, ...appt };
    },
    
    // Find appointments for a specific client (user)
    async findByUser(userId) {
        const sql = `
            SELECT a.*, u_therapist.full_name as therapist_name
            FROM appointments a
            JOIN therapists t ON a.therapist_id = t.therapist_id
            JOIN users u_therapist ON t.user_id = u_therapist.user_id
            WHERE a.user_id = ?
            ORDER BY a.appointment_time DESC`;
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    },

    // Find appointments for a specific provider (therapist)
    async findByTherapist(therapistId) {
        const sql = `
            SELECT a.*, u_client.full_name as client_name
            FROM appointments a
            JOIN users u_client ON a.user_id = u_client.user_id
            WHERE a.therapist_id = ?
            ORDER BY a.appointment_time DESC`;
        const [rows] = await pool.query(sql, [therapistId]);
        return rows;
    },

    async updateStatus(id, status) {
        const sql = `UPDATE appointments SET status = ? WHERE appointment_id = ?`;
        const [result] = await pool.query(sql, [status, id]);
        return result.affectedRows;
    },

    async delete(id) {
        const [result] = await pool.query("DELETE FROM appointments WHERE appointment_id = ?", [id]);
        return result.affectedRows;
    },
    
    // Find all appointments
    async findAll() {
        const sql = `
            SELECT a.*, 
                   u_client.full_name as client_name, 
                   u_therapist.full_name as therapist_name
            FROM appointments a
            JOIN users u_client ON a.user_id = u_client.user_id
            JOIN therapists t ON a.therapist_id = t.therapist_id
            JOIN users u_therapist ON t.user_id = u_therapist.user_id
            ORDER BY a.appointment_time DESC`;
        const [rows] = await pool.query(sql);
        return rows;
    }
};

module.exports = AppointmentModel;
const Appointment = require('./appointment.model');

exports.createAppointment = async (req, res) => {
    try {
        const newAppt = await Appointment.create(req.body);
        res.status(201).json(newAppt);
    } catch (error) {
        res.status(500).json({ message: "Error scheduling appointment", error: error.message });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        // The auth middleware sets req.user.id, not req.user.user_id
        const userId = req.user.id;
        
        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }
        
        const appointments = await Appointment.findByUser(userId);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your appointments", error: error.message });
    }
};

exports.getAppointmentsForTherapist = async (req, res) => {
    try {
        const appointments = await Appointment.findByTherapist(req.params.therapistId);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching therapist appointments", error: error.message });
    }
};

exports.getAppointmentsForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        const appointments = await Appointment.findByUser(userId);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user appointments", error: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }
        const affectedRows = await Appointment.updateStatus(req.params.id, status);
        if (affectedRows === 0) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json({ message: `Appointment status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment", error: error.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const affectedRows = await Appointment.delete(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment", error: error.message });
    }
};
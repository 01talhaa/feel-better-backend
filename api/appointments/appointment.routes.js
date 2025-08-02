const express = require('express');
const router = express.Router();
const controller = require('./appointment.controller');
const { protect } = require('../../api/middleware/auth.middleware');

// Root route to get all appointments
router.get('/', controller.getAllAppointments);

// Create a new appointment
router.post('/', controller.createAppointment);

// Get all appointments for the currently authenticated user
router.get('/my-appointments', protect, controller.getMyAppointments);

// Get all appointments for a specific user (client)
router.get('/user/:userId', controller.getAppointmentsForUser);

// Get all appointments for a specific therapist
router.get('/therapist/:therapistId', controller.getAppointmentsForTherapist);

// Update an appointment's status (e.g., 'COMPLETED', 'CANCELLED')
router.patch('/:id/status', controller.updateAppointmentStatus);

// Delete an appointment
router.delete('/:id', controller.cancelAppointment);

module.exports = router;
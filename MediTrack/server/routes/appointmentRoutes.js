const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

// All routes here require auth
router.post('/', auth, bookAppointment);
router.get('/', auth, getAppointments);
router.put('/:id', auth, updateAppointmentStatus);

module.exports = router;

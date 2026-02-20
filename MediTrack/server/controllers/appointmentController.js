const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Book Appointment (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorName, department, date, timeSlot } = req.body;

        // Ideally we should check if doctor exists, but requirement says "doctor name" only.
        // We will just save the string.

        const newAppointment = new Appointment({
            patientId: req.user.id,
            patientName: req.user.name || 'Unknown', // Ideally fetch from DB if not in token, but simple for now
            doctorName,
            department,
            date,
            timeSlot
        });

        // Fetch patient name if needed, but let's assume we can get it or just store it.
        // Actually, let's fetch the user to be sure about the name if it wasn't in the token payload fully or just rely on the user ID
        const user = await User.findById(req.user.id);
        if (user) newAppointment.patientName = user.name;

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Appointments (Patient: own, Doctor: assigned to them)
exports.getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patientId: req.user.id }).sort({ date: -1 });
        } else if (req.user.role === 'doctor') {
            // Requirement says "View appointments assigned to them".
            // Since we store "doctorName" as a string, we match by name.
            // CAUTION: This assumes the doctor's name in User model matches the "doctor name" in Appointment.
            // A better way is using doctorId, but prompt specified "doctor name".
            // Let's fetch the current doctor's name first.
            const doctor = await User.findById(req.user.id);
            if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

            appointments = await Appointment.find({ doctorName: doctor.name }).sort({ date: -1 });
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Appointment Status (Doctor only)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied. Doctors only.' });
        }

        const { status } = req.body;
        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // We should ensure the appointment belongs to this doctor
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const doctor = await User.findById(req.user.id);
        if (appointment.doctorName !== doctor.name) {
            return res.status(403).json({ message: 'Not authorized to update this appointment' });
        }

        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

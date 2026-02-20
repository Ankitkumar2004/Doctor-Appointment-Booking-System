const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General', 'Dermatology']
    },
    date: {
        type: String, // Storing as String for simplicity as per requirement
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

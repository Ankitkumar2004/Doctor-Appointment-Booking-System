const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Register Patient
        const patientEmail = `patient_${Date.now()}@example.com`;
        console.log(`\n1. Registering Patient: ${patientEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            name: 'John Doe',
            email: patientEmail,
            password: 'password123',
            role: 'patient'
        });
        console.log('   Client Registered Successfully');

        // 2. Login Patient
        console.log('\n2. Logging in Patient');
        const patientLogin = await axios.post(`${API_URL}/auth/login`, {
            email: patientEmail,
            password: 'password123'
        });
        const patientToken = patientLogin.data.token;
        console.log('   Patient Logged In. Token received.');

        // 3. Register Doctor
        const doctorEmail = `doctor_${Date.now()}@example.com`;
        console.log(`\n3. Registering Doctor: ${doctorEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Dr. Smith',
            email: doctorEmail,
            password: 'password123',
            role: 'doctor'
        });
        console.log('   Doctor Registered Successfully');

        // 4. Login Doctor
        console.log('\n4. Logging in Doctor');
        const doctorLogin = await axios.post(`${API_URL}/auth/login`, {
            email: doctorEmail,
            password: 'password123'
        });
        const doctorToken = doctorLogin.data.token;
        console.log('   Doctor Logged In. Token received.');

        // 5. Book Appointment (Patient)
        console.log('\n5. Booking Appointment');
        const appointmentRes = await axios.post(`${API_URL}/appointments`, {
            doctorName: 'Dr. Smith',
            department: 'Cardiology',
            date: '2024-12-25',
            timeSlot: '10:00'
        }, {
            headers: { 'x-auth-token': patientToken }
        });
        const appointmentId = appointmentRes.data._id;
        console.log(`   Appointment Booked. ID: ${appointmentId}`);

        // 6. View Appointments (Doctor)
        console.log('\n6. Doctor Viewing Appointments');
        const doctorAppts = await axios.get(`${API_URL}/appointments`, {
            headers: { 'x-auth-token': doctorToken }
        });
        const foundAppt = doctorAppts.data.find(a => a._id === appointmentId);
        if (foundAppt) {
            console.log('   Appointment found in Doctor dashboard.');
        } else {
            console.error('   FAILED: Appointment not found for doctor.');
        }

        // 7. Approve Appointment (Doctor)
        console.log('\n7. Doctor Approving Appointment');
        await axios.put(`${API_URL}/appointments/${appointmentId}`, {
            status: 'approved'
        }, {
            headers: { 'x-auth-token': doctorToken }
        });
        console.log('   Appointment Approved.');

        // 8. Verify Status (Patient)
        console.log('\n8. Patient Verifying Status');
        const patientAppts = await axios.get(`${API_URL}/appointments`, {
            headers: { 'x-auth-token': patientToken }
        });
        const updatedAppt = patientAppts.data.find(a => a._id === appointmentId);
        if (updatedAppt.status === 'approved') {
            console.log('   SUCCESS: Appointment status is APPROVED.');
        } else {
            console.error(`   FAILED: Appointment status is ${updatedAppt.status}`);
        }

        console.log('\n--- Verification Complete ---');

    } catch (err) {
        console.error('Verification Failed:', err.response ? err.response.data : err.message);
    }
};

runVerification();

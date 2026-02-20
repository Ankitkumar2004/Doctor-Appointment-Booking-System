import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        doctorName: '',
        department: 'General',
        date: '',
        timeSlot: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/api/appointments', {
                headers: { 'x-auth-token': token }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/appointments', formData, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Appointment booked successfully!');
            fetchAppointments();
            setFormData({ doctorName: '', department: 'General', date: '', timeSlot: '' });
        } catch (err) {
            setMessage('Failed to book appointment.');
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 shadow-2xl text-white">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">Hello, {user.name}</h1>
                    <p className="text-indigo-100 text-lg opacity-90">Manage your appointments to stay on top of your health.</p>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-900 opacity-20 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Book Appointment Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
                        <div className="bg-slate-50 p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                New Appointment
                            </h2>
                        </div>
                        <div className="p-6">
                            {message && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3 ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message.includes('success') ? (
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    )}
                                    {message}
                                </div>
                            )}
                            <form onSubmit={handleBook} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium appearance-none transition-shadow"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option>General</option>
                                            <option>Cardiology</option>
                                            <option>Neurology</option>
                                            <option>Orthopedics</option>
                                            <option>Pediatrics</option>
                                            <option>Dermatology</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Doctor's Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium placeholder-slate-400 transition-shadow"
                                        value={formData.doctorName}
                                        onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                        required
                                        placeholder="e.g. Dr. House"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium transition-shadow"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium transition-shadow"
                                            value={formData.timeSlot}
                                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2 mt-4">
                                    <span>Confirm Booking</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* My Appointments List */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </span>
                        My Appointments
                    </h2>

                    {appointments.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No appointments yet</h3>
                            <p className="text-slate-500 mt-1">Book your first appointment to get started.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map((appt) => (
                                <div key={appt._id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                                                {appt.doctorName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">{appt.doctorName}</h3>
                                                <p className="text-indigo-600 font-medium text-sm">{appt.department} Specialist</p>
                                                <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        {appt.date}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {appt.timeSlot}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold capitalize border
                                                ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                                                ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                                                ${appt.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                                            `}>
                                                {appt.status === 'approved' && <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                                {appt.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;

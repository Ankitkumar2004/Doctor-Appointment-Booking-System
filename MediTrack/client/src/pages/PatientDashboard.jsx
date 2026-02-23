import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const STATUS_STYLES = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
};

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        doctorName: '',
        department: 'General',
        date: '',
        timeSlot: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loadingBook, setLoadingBook] = useState(false);

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
        setLoadingBook(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/appointments', formData, {
                headers: { 'x-auth-token': token }
            });
            setMessage({ text: 'Appointment booked successfully!', type: 'success' });
            fetchAppointments();
            setFormData({ doctorName: '', department: 'General', date: '', timeSlot: '' });
        } catch (err) {
            setMessage({ text: 'Failed to book appointment.', type: 'error' });
            console.error(err);
        } finally {
            setLoadingBook(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    const departments = ['General', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'];

    const counts = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        approved: appointments.filter(a => a.status === 'approved').length,
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <p className="text-teal-200 text-sm font-semibold uppercase tracking-widest mb-1">Patient Portal</p>
                    <h1 className="text-3xl font-extrabold mb-2">Hello, {user.name} 👋</h1>
                    <p className="text-teal-100 text-base opacity-90">Here's an overview of your appointments and health activity.</p>
                </div>
                <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-teal-900/20 rounded-full blur-2xl"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total', value: counts.total, color: 'from-teal-500 to-teal-600' },
                    { label: 'Pending', value: counts.pending, color: 'from-amber-400 to-amber-500' },
                    { label: 'Approved', value: counts.approved, color: 'from-emerald-500 to-emerald-600' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg font-bold mb-2 shadow`}>
                            {value}
                        </div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Book Appointment Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-20">
                        <div className="bg-teal-600 p-5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Book Appointment
                            </h2>
                            <p className="text-teal-200 text-sm mt-1">Fill in the details below</p>
                        </div>
                        <div className="p-6">
                            {message.text && (
                                <div className={`p-3.5 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {message.type === 'success'
                                        ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                        : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    }
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleBook} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-700 font-medium transition-all"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        {departments.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Doctor's Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-700 font-medium placeholder-slate-400 transition-all"
                                        value={formData.doctorName}
                                        onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                        required
                                        placeholder="e.g. Dr. Kapoor"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-slate-700 font-medium transition-all"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-slate-700 font-medium transition-all"
                                            value={formData.timeSlot}
                                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingBook}
                                    className="w-full bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 flex justify-center items-center gap-2 mt-2 disabled:opacity-60"
                                >
                                    {loadingBook ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-8 space-y-5">
                    <h2 className="text-xl font-bold text-slate-800">My Appointments</h2>

                    {appointments.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-14 text-center">
                            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">No appointments yet</h3>
                            <p className="text-slate-500 mt-1 text-sm">Book your first appointment using the form.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map((appt) => (
                                <div key={appt._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-100 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-base shadow">
                                                {appt.doctorName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-800">{appt.doctorName}</h3>
                                                <p className="text-teal-600 font-medium text-sm">{appt.department}</p>
                                                <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-xs">
                                                    <span className="flex items-center gap-1">📅 {appt.date}</span>
                                                    <span className="flex items-center gap-1">🕐 {appt.timeSlot}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold capitalize border ${STATUS_STYLES[appt.status] || ''}`}>
                                            {appt.status}
                                        </span>
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

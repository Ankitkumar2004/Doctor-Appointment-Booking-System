import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const STATUS_STYLES = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
};

const DOT_STYLES = {
    approved: 'bg-emerald-500',
    pending: 'bg-amber-400',
    rejected: 'bg-red-500',
};

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');

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

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/appointments/${id}`, { status }, {
                headers: { 'x-auth-token': token }
            });
            fetchAppointments();
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const pending = appointments.filter(a => a.status === 'pending').length;
    const approved = appointments.filter(a => a.status === 'approved').length;
    const rejected = appointments.filter(a => a.status === 'rejected').length;

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-teal-200 text-sm font-semibold uppercase tracking-widest mb-1">Doctor's Portal</p>
                        <h1 className="text-3xl font-extrabold">Good day, Dr. {user?.name} 🩺</h1>
                        <p className="text-teal-100 text-sm mt-2">Manage and respond to your patient appointment requests.</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl flex items-center gap-2.5">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold">Live — Online</span>
                    </div>
                </div>
                <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: appointments.length, color: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'Pending', value: pending, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Approved', value: approved, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Rejected', value: rejected, color: 'text-red-500', bg: 'bg-red-50' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Appointment Requests</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Review and take action on patient bookings</p>
                    </div>
                    {/* Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'approved', 'rejected'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filter === f
                                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-teal-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((appt) => (
                                <tr key={appt._id} className="hover:bg-teal-50/30 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {appt.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{appt.patientName}</p>
                                                <p className="text-xs text-slate-400">#{appt._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                                            {appt.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <p className="text-sm font-bold text-slate-800">{appt.date}</p>
                                        <p className="text-xs text-teal-600 font-semibold mt-0.5">{appt.timeSlot}</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[appt.status] || ''}`}>
                                            <span className={`w-2 h-2 rounded-full ${DOT_STYLES[appt.status] || ''}`}></span>
                                            {appt.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {appt.status === 'pending' ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'approved')}
                                                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                                    className="flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-medium italic">Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No Requests Found</h3>
                        <p className="text-slate-500 mt-1 text-sm">
                            {filter === 'all' ? 'No appointments yet. Check back later.' : `No ${filter} appointments to show.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;

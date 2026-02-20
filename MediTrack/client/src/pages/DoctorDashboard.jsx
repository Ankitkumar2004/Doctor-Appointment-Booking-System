import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/appointments', {
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
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status }, {
                headers: { 'x-auth-token': token }
            });
            fetchAppointments();
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">Doctor's Portal</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your schedule and patient requests efficienty.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-700">Live Status: Online</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Appointment Requests</h2>
                        <p className="text-slate-500 text-sm mt-1">Review and manage patient bookings</p>
                    </div>
                    <span className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-200">
                        {appointments.length} Active Requests
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.map((appt) => (
                                <tr key={appt._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-100">
                                                {appt.patientName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-base font-bold text-slate-800">{appt.patientName}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">Patient ID: #{appt._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                            {appt.department}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-sm">{appt.date}</span>
                                            <span className="text-indigo-600 text-xs font-bold mt-1 bg-indigo-50 px-2 py-0.5 rounded w-fit">{appt.timeSlot}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border
                                            ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                                            ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                                            ${appt.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                                        `}>
                                            <span className={`w-2 h-2 rounded-full mr-2
                                                ${appt.status === 'approved' ? 'bg-emerald-500' : ''}
                                                ${appt.status === 'pending' ? 'bg-amber-500' : ''}
                                                ${appt.status === 'rejected' ? 'bg-red-500' : ''}
                                            `}></span>
                                            {appt.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                        {appt.status === 'pending' ? (
                                            <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'approved')}
                                                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                                                    title="Approve Appointment"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                                    className="flex items-center gap-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:border-red-300"
                                                    title="Reject Appointment"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-medium italic">Action Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {appointments.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Pending Requests</h3>
                        <p className="text-slate-500 mt-2">All caught up! Check back later for new appointments.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;

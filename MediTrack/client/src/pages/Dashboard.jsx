import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">
                                MediTrack
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{user?.role}</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                            <button
                                onClick={logout}
                                className="group flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all duration-200"
                            >
                                <span className="text-sm font-medium hidden md:block group-hover:underline decoration-red-600/30 underline-offset-4">Sign Out</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {user?.role === 'patient' && <PatientDashboard />}
                {user?.role === 'doctor' && <DoctorDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;

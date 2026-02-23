import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* Navbar */}
            <nav className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-600 text-white p-2 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-extrabold text-teal-700 tracking-tight">
                                HealthSync
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
                                    <p className="text-xs font-medium text-teal-600 capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <div className="h-7 w-px bg-slate-200 hidden md:block"></div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all duration-200 text-sm font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden md:block">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user?.role === 'patient' && <PatientDashboard />}
                {user?.role === 'doctor' && <DoctorDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;

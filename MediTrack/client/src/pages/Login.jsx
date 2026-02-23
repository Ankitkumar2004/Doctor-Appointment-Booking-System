import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(formData.email, formData.password);
        setLoading(false);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 flex-col justify-between p-12 text-white">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">HealthSync</span>
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold leading-tight mb-4">Your health, <br />our priority.</h2>
                    <p className="text-teal-100 text-lg">Seamlessly connect with your doctors and manage all your medical appointments in one place.</p>
                </div>
                <div className="flex gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex-1">
                        <p className="text-3xl font-bold">200+</p>
                        <p className="text-teal-200 text-sm mt-1">Specialist Doctors</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex-1">
                        <p className="text-3xl font-bold">15k+</p>
                        <p className="text-teal-200 text-sm mt-1">Happy Patients</p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1>
                        <p className="text-slate-500 mt-2">Sign in to your HealthSync account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl text-sm flex items-center gap-3" role="alert">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-slate-800 placeholder-slate-400"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-slate-800 placeholder-slate-400"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-lg shadow-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <p className="text-center text-sm text-slate-600 pt-2">
                            Don't have an account?{' '}
                            <a href="/register" className="text-teal-600 hover:text-teal-800 font-bold hover:underline underline-offset-4">
                                Register now
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

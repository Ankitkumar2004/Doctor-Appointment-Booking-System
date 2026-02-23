import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await register(formData.name, formData.email, formData.password, formData.role);
        setLoading(false);
        if (res.success) {
            navigate('/login');
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
                    <h2 className="text-4xl font-extrabold leading-tight mb-4">Join thousands of patients & doctors.</h2>
                    <p className="text-teal-100 text-lg">Book appointments, track your health journey, and get the care you deserve — all in one app.</p>
                </div>
                <div className="space-y-4">
                    {['Secure & private health data', 'Instant appointment confirmations', 'Real-time doctor availability'].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-teal-100 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900">Create your account</h1>
                        <p className="text-slate-500 mt-2">Join HealthSync — it's free and always will be</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl text-sm flex items-center gap-3" role="alert">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Rishabh Singh"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder-slate-400"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder-slate-400"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Min. 6 characters"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder-slate-400"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">I am registering as...</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[{ value: 'patient', label: 'Patient', icon: '🧑‍⚕️' }, { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' }].map(({ value, label, icon }) => (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => setFormData({ ...formData, role: value })}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition-all text-sm ${formData.role === value
                                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <span className="text-xl">{icon}</span> {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-lg shadow-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <p className="text-center text-sm text-slate-600 pt-2">
                            Already have an account?{' '}
                            <a href="/login" className="text-teal-600 hover:text-teal-800 font-bold hover:underline underline-offset-4">
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

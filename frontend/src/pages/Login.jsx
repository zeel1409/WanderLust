import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(form.email, form.password);
        if (result.success) {
            toast.success('Welcome back! 🎉');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop"
                    alt="Login background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF385C]/80 to-purple-900/80" />
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <Link to="/" className="flex items-center gap-2 mb-12">
                        <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none">
                            <path d="M16 1C7.163 1 0 8.163 0 17c0 6.627 3.838 12.37 9.432 15.18L16 31l6.568 1.18C28.162 29.37 32 23.627 32 17 32 8.163 24.837 1 16 1z" fill="white" />
                            <path d="M16 6c-1.5 0-5 4-5 9s3.5 9 5 9 5-4 5-9-3.5-9-5-9z" fill="#FF385C" />
                        </svg>
                        <span className="text-2xl font-bold">wanderlust</span>
                    </Link>
                    <h2 className="text-4xl font-extrabold mb-4">Welcome back,<br />explorer! 🌍</h2>
                    <p className="text-white/80 text-lg">Sign in to continue your journey and discover your next perfect stay.</p>
                    <div className="mt-10 flex flex-col gap-4">
                        {['10M+ listings worldwide', 'Best price guarantee', 'Instant booking'].map((t) => (
                            <div key={t} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                                    <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                                </div>
                                <span className="text-white/90 font-medium">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
                        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                            <path d="M16 1C7.163 1 0 8.163 0 17c0 6.627 3.838 12.37 9.432 15.18L16 31l6.568 1.18C28.162 29.37 32 23.627 32 17 32 8.163 24.837 1 16 1z" fill="#FF385C" />
                            <path d="M16 6c-1.5 0-5 4-5 9s3.5 9 5 9 5-4 5-9-3.5-9-5-9z" fill="white" />
                        </svg>
                        <span className="text-xl font-bold" style={{ color: '#FF385C' }}>wanderlust</span>
                    </Link>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Log in</h1>
                    <p className="text-gray-500 mb-8">Don't have an account? <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#FF385C' }}>Sign up</Link></p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPass ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full text-center mt-2" style={{ opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400">
                            By logging in, you agree to our{' '}
                            <a href="#" className="underline">Terms of Service</a> and{' '}
                            <a href="#" className="underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

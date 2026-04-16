import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Logged in!');
            navigate('/');
        } else {
            toast.error(result.message || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f9fafb' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
                {/* logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '1.5rem' }}>
                    <svg viewBox="0 0 32 32" style={{ width: '28px', height: '28px' }} fill="none">
                        <path d="M16 1C7.163 1 0 8.163 0 17c0 6.627 3.838 12.37 9.432 15.18L16 31l6.568 1.18C28.162 29.37 32 23.627 32 17 32 8.163 24.837 1 16 1z" fill="#FF385C" />
                        <path d="M16 6c-1.5 0-5 4-5 9s3.5 9 5 9 5-4 5-9-3.5-9-5-9z" fill="white" />
                    </svg>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FF385C' }}>wanderlust</span>
                </Link>

                <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 700, color: '#111827' }}>Log in</h1>
                <p style={{ margin: '0 0 1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#FF385C', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                style={{ paddingRight: '48px' }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', cursor: 'pointer', color: '#9ca3af'
                                }}
                            >
                                {showPass ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
                    By logging in you agree to our{' '}
                    <a href="#" style={{ textDecoration: 'underline', color: '#6b7280' }}>Terms</a> and{' '}
                    <a href="#" style={{ textDecoration: 'underline', color: '#6b7280' }}>Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default Login;

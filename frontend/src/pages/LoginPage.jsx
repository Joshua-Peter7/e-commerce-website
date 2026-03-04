import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(form.email, form.password);
        if (result.success) navigate('/');
        else setError(result.message);
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <Link to="/" className="auth-page__logo">
                        <span className="auth-page__logo-mark">S</span>
                        <span>STRIDE</span>
                    </Link>
                    <h1 className="auth-page__title">Welcome back</h1>
                    <p className="auth-page__subtitle">Sign in to your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="btn btn-primary btn--full" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-page__footer">
                    <p>Don't have an account? <Link to="/register">Create Account</Link></p>
                </div>

                <div className="auth-page__demo">
                    <p className="label" style={{ textAlign: 'center', marginBottom: 8 }}>Demo Account</p>
                    <button className="btn btn-ghost btn--sm btn--full" onClick={() => setForm({ email: 'admin@stridestore.com', password: 'admin123' })}>
                        Use Demo Credentials
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

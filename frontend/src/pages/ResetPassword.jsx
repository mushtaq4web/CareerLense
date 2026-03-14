import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirm) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (password !== confirm) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, token, password });
            setDone(true);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Invalid reset link
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        This link is invalid or has expired.
                    </p>
                    <Link to="/forgot-password" className="btn-primary px-6 py-2.5 text-sm">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex items-center gap-2.5 justify-center mb-8">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow-sm">
                        <span className="text-white font-bold font-mono text-sm">CL</span>
                    </div>
                    <span className="font-display text-xl font-bold text-gradient">CareerLense</span>
                </div>

                {done ? (
                    <div className="text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Password reset!
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Redirecting you to sign in…
                        </p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Set new password
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            Choose a strong password for your account.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="Min. 6 characters"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="••••••••"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Resetting…
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
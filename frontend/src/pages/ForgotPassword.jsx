import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

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

                {sent ? (
                    <div className="text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Check your email
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            If <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span> is registered,
                            you'll receive a password reset link shortly.
                        </p>
                        <p className="text-xs text-slate-400 mb-6">
                            Didn't receive it? Check your spam folder or{' '}
                            <button
                                onClick={() => setSent(false)}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                            >
                                try again
                            </button>
                        </p>
                        <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                            ← Back to sign in
                        </Link>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Forgot password?
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            Enter your email and we'll send you a reset link.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="you@example.com"
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
                                        Sending…
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Remember your password?{' '}
                            <Link to="/" className="text-primary-600 font-semibold hover:text-primary-700 dark:text-primary-400">
                                Sign in
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
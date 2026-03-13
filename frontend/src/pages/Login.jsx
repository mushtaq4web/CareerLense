import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12
                            bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600">
                {/* Decorative blobs */}
                <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full
                                bg-white/10 blur-3xl animate-float" />
                <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full
                                bg-accent-500/20 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full
                                bg-primary-500/10 blur-3xl" />

                {/* Brand */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg font-mono">CL</span>
                        </div>
                        <span className="text-white font-display text-2xl font-bold">CareerLense</span>
                    </div>
                </div>

                {/* Main copy */}
                <div className="relative z-10 my-auto">
                    <h2 className="text-4xl font-display text-white font-bold leading-tight mb-4">
                        Your career<br />
                        <span className="text-accent-300 italic">in sharp focus.</span>
                    </h2>
                    <p className="text-primary-100/80 text-base leading-relaxed mb-10 max-w-xs">
                        Build standout resumes, track every application, and walk into every interview with confidence.
                    </p>

                    <div className="space-y-3">
                        {[
                            { icon: '📄', label: 'Professional resume builder' },
                            { icon: '📊', label: 'Smart job application tracker' },
                            { icon: '🎯', label: 'AI-powered interview prep' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-sm flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-primary-100/90 text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-primary-200/60 text-xs">© 2026 CareerLense. All rights reserved.</p>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-sm">

                    {/* Mobile brand */}
                    <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow-sm">
                            <span className="text-white font-bold font-mono text-sm">CL</span>
                        </div>
                        <span className="font-display text-xl font-bold text-gradient">CareerLense</span>
                    </div>

                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            Sign in to continue building your career
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
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
                                    id="login-email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
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
                                    placeholder="••••••••"
                                    disabled={loading}
                                    id="login-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            id="login-submit"
                            className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

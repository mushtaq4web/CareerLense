import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
    {
        to: '/dashboard',
        label: 'Dashboard',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
            </svg>
        ),
    },
    {
        to: '/resumes',
        label: 'Resumes',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        to: '/jobs',
        label: 'Job Tracker',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        to: '/analytics',
        label: 'Analytics',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        to: '/interview-prep',
        label: 'Interview',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
    },
];

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Generate avatar initials
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    if (!isAuthenticated) return null;

    return (
        <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-xl shadow-sm dark:bg-slate-950/75 dark:border-slate-700/60 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-700 to-primary-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                                <span className="text-white font-bold text-base font-mono leading-none">CL</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-display text-gradient font-bold">CareerLense</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-0.5">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                                    }
                                >
                                    {link.icon}
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* User info + avatar */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">{user?.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-none">{user?.email}</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                                {initials}
                            </div>
                        </div>

                        {/* Logout – desktop */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200/80 bg-red-50/60 hover:bg-red-100/80 hover:border-red-300 transition-all duration-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/35"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:border-slate-700 transition-all duration-200 hover:border-primary-300"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className={`w-5 h-5 transition-transform duration-200 ${mobileOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                        ? 'bg-primary-100/70 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                                        : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
                                    }`
                                }
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                        <div className="pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 px-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
                                    {initials}
                                </div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

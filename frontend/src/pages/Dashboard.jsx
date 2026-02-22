import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const StatCard = ({ label, value, color, icon, delay = 0 }) => (
    <div
        className="card-stat animate-slide-up"
        style={{ animationDelay: `${delay}s` }}
    >
        {/* Accent left border */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${color.bar}`} />

        <div className="flex items-start justify-between">
            <div className="pl-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    {label}
                </p>
                <p className={`text-4xl font-display font-bold ${color.text}`}>{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color.icon}`}>
                {icon}
            </div>
        </div>
    </div>
);

const QuickAction = ({ label, description, onClick, color, icon, id }) => (
    <button
        id={id}
        onClick={onClick}
        className={`group w-full p-5 rounded-2xl border-2 text-left
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                    ${color.bg} ${color.border} hover:${color.hoverBorder}`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                            ${color.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                {icon}
            </div>
            <div>
                <p className={`font-bold text-sm ${color.label}`}>{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
            </div>
            <svg className={`w-4 h-4 ml-auto ${color.arrow} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </button>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        resumeCount: 0, totalJobs: 0, applied: 0, interview: 0, offer: 0, rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const [resumesRes, jobsRes] = await Promise.all([
                api.get('/resumes'),
                api.get('/jobs'),
            ]);
            const resumes = resumesRes.data;
            const jobs = jobsRes.data;
            setStats({
                resumeCount: resumes.length,
                totalJobs: jobs.length,
                applied: jobs.filter(j => j.status === 'Applied').length,
                interview: jobs.filter(j => j.status === 'Interview').length,
                offer: jobs.filter(j => j.status === 'Offer').length,
                rejected: jobs.filter(j => j.status === 'Rejected').length,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );

    const statCards = [
        {
            label: 'Total Resumes', value: stats.resumeCount,
            color: { bar: 'bg-primary-500', text: 'text-primary-600 dark:text-primary-400', icon: 'bg-primary-50 dark:bg-primary-900/30', arrow: 'text-primary-600' },
            icon: <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            delay: 0,
        },
        {
            label: 'Applications', value: stats.totalJobs,
            color: { bar: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', icon: 'bg-accent-50 dark:bg-accent-900/30', arrow: 'text-accent-600' },
            icon: <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            delay: 0.05,
        },
        {
            label: 'Applied', value: stats.applied,
            color: { bar: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-50 dark:bg-blue-900/30', arrow: 'text-blue-600' },
            icon: <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
            delay: 0.1,
        },
        {
            label: 'Interviews', value: stats.interview,
            color: { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', icon: 'bg-amber-50 dark:bg-amber-900/30', arrow: 'text-amber-600' },
            icon: <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
            delay: 0.15,
        },
        {
            label: 'Offers', value: stats.offer,
            color: { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', icon: 'bg-emerald-50 dark:bg-emerald-900/30', arrow: 'text-emerald-600' },
            icon: <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            delay: 0.2,
        },
        {
            label: 'Rejected', value: stats.rejected,
            color: { bar: 'bg-red-400', text: 'text-red-600 dark:text-red-400', icon: 'bg-red-50 dark:bg-red-900/30', arrow: 'text-red-500' },
            icon: <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            delay: 0.25,
        },
    ];

    const quickActions = [
        {
            id: 'qa-create-resume',
            label: 'Create Resume',
            description: 'Build a new professional resume',
            onClick: () => navigate('/resumes/create'),
            color: {
                bg: 'bg-gradient-to-br from-primary-50 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-900/10',
                border: 'border-primary-200 dark:border-primary-700/60',
                hoverBorder: 'border-primary-400',
                iconBg: 'bg-primary-600',
                label: 'text-slate-800 dark:text-slate-100',
                arrow: 'text-primary-600',
            },
            icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
        },
        {
            id: 'qa-view-resumes',
            label: 'View Resumes',
            description: 'Manage all your resumes',
            onClick: () => navigate('/resumes'),
            color: {
                bg: 'bg-gradient-to-br from-accent-50 to-amber-100/80 dark:from-accent-900/20 dark:to-accent-900/10',
                border: 'border-accent-200 dark:border-accent-700/60',
                hoverBorder: 'border-accent-400',
                iconBg: 'bg-accent-500',
                label: 'text-slate-800 dark:text-slate-100',
                arrow: 'text-accent-600',
            },
            icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
        },
        {
            id: 'qa-job-tracker',
            label: 'Job Tracker',
            description: 'Track your applications',
            onClick: () => navigate('/jobs'),
            color: {
                bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/80 dark:from-emerald-900/20 dark:to-emerald-900/10',
                border: 'border-emerald-200 dark:border-emerald-700/60',
                hoverBorder: 'border-emerald-400',
                iconBg: 'bg-emerald-600',
                label: 'text-slate-800 dark:text-slate-100',
                arrow: 'text-emerald-600',
            },
            icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
        },
    ];

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Hero greeting */}
                <div className="mb-10 animate-fade-in">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1 uppercase tracking-widest">
                                {getGreeting()}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                {user?.name} <span className="text-2xl md:text-3xl">👋</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
                                Here&apos;s a snapshot of your career journey today.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="card animate-scale-in">
                    <div className="section-header mb-6">
                        <div className="section-icon">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="section-title">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {quickActions.map((action) => (
                            <QuickAction key={action.id} {...action} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        resumeCount: 0,
        totalJobs: 0,
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-5xl font-display font-bold text-gray-800 mb-3">
                        Welcome back, <span className="text-gradient">{user?.name}</span>! 👋
                    </h1>
                    <p className="text-xl text-gray-600">
                        Here's an overview of your career journey
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Resume Count */}
                    <div className="card-gradient animate-slide-up">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    Total Resumes
                                </p>
                                <p className="text-4xl font-bold text-primary-600">{stats.resumeCount}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Jobs */}
                    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    Total Applications
                                </p>
                                <p className="text-4xl font-bold text-accent-600">{stats.totalJobs}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Applied */}
                    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    Applied
                                </p>
                                <p className="text-4xl font-bold text-blue-600">{stats.applied}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Interview */}
                    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    Interview
                                </p>
                                <p className="text-4xl font-bold text-yellow-600">{stats.interview}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Offer */}
                    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    Offers
                                </p>
                                <p className="text-4xl font-bold text-green-600">{stats.offer}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Rejected */}
                    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                    Rejected
                                </p>
                                <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card animate-scale-in">
                    <h2 className="section-title mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/resumes/create')}
                            className="group p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-800">Create Resume</p>
                                    <p className="text-sm text-gray-600">Build a new resume</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/resumes')}
                            className="group p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border-2 border-accent-200 hover:border-accent-400 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-800">View Resumes</p>
                                    <p className="text-sm text-gray-600">Manage your resumes</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/jobs')}
                            className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-800">Job Tracker</p>
                                    <p className="text-sm text-gray-600">Track applications</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

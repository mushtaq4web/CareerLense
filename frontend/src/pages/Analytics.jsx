import { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CHART_COLORS = ['#2e9e86', '#ea8f14', '#3b82f6', '#ef4444', '#8b5cf6'];

const MetricCard = ({ label, value, sublabel, color, icon, delay = 0 }) => (
    <div
        className="card-stat animate-slide-up"
        style={{ animationDelay: `${delay}s` }}
    >
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: color }} />
        <div className="flex items-start justify-between pl-3">
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">{label}</p>
                <p className="text-3xl font-display font-bold" style={{ color }}>{value}</p>
                {sublabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sublabel}</p>}
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: `${color}18` }}>
                {icon}
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="card">
        <h2 className="section-title mb-5">{title}</h2>
        {children}
    </div>
);

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            const [dashboardRes, resumeRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/resumes'),
            ]);
            setDashboardData(dashboardRes.data);
            setResumeData(resumeRes.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );

    if (!dashboardData) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="card text-center max-w-sm w-full py-16">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-xl font-display font-bold text-slate-700 dark:text-slate-300 mb-2">No data yet</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Add some job applications to see analytics</p>
            </div>
        </div>
    );

    const statusData = [
        { name: 'Applied', value: dashboardData.statusBreakdown.applied },
        { name: 'Interview', value: dashboardData.statusBreakdown.interview },
        { name: 'Offer', value: dashboardData.statusBreakdown.offer },
        { name: 'Rejected', value: dashboardData.statusBreakdown.rejected },
    ].filter(item => item.value > 0);

    const metrics = [
        { label: 'Total Applications', value: dashboardData.totalApplications, color: '#2e9e86', icon: '📋', delay: 0 },
        { label: 'Success Rate', value: `${dashboardData.successRate}%`, sublabel: 'Interviews + Offers', color: '#10b981', icon: '🎯', delay: 0.05 },
        { label: 'Avg Response', value: dashboardData.avgResponseTime > 0 ? `${dashboardData.avgResponseTime}d` : 'N/A', sublabel: 'Days to hear back', color: '#8b5cf6', icon: '⏱️', delay: 0.1 },
        { label: 'Active Interviews', value: dashboardData.statusBreakdown.interview, color: '#ea8f14', icon: '💬', delay: 0.15 },
    ];

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="page-title mb-1">Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Track your job search performance and progress</p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {metrics.map(m => <MetricCard key={m.label} {...m} />)}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ChartCard title="Application Status Distribution">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%" cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={90}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-slate-500 dark:text-slate-400 text-sm">
                                No data yet — add some job applications
                            </div>
                        )}
                    </ChartCard>

                    <ChartCard title="Industry Performance">
                        {dashboardData.industryInsights?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={dashboardData.industryInsights.slice(0, 5)}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                                    <XAxis dataKey="industry" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
                                    <Legend />
                                    <Bar dataKey="applications" fill="#2e9e86" name="Applications" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="interviews" fill="#ea8f14" name="Interviews" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-slate-500 dark:text-slate-400 text-sm text-center">
                                Add industry info to your job applications<br />to see insights here
                            </div>
                        )}
                    </ChartCard>
                </div>

                {/* Resume Performance Table */}
                {resumeData?.resumes?.length > 0 && (
                    <div className="card mb-6">
                        <h2 className="section-title mb-5">Resume Performance</h2>
                        <div className="overflow-x-auto">
                            <table className="table-base w-full">
                                <thead>
                                    <tr>
                                        {['Resume Title', 'Template', 'Views', 'Downloads', 'Last Updated'].map(h => (
                                            <th key={h} className="table-th">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumeData.resumes.map((resume) => (
                                        <tr key={resume.id} className="table-row">
                                            <td className="table-td font-semibold text-slate-800 dark:text-slate-200">{resume.title}</td>
                                            <td className="table-td capitalize">{resume.template}</td>
                                            <td className="table-td">{resume.views || 0}</td>
                                            <td className="table-td">{resume.downloads || 0}</td>
                                            <td className="table-td">{new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {resumeData.templatePopularity?.length > 0 && (
                            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Template Popularity</h3>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.templatePopularity.map((item) => (
                                        <div key={item.template} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200/60 dark:border-primary-800/40">
                                            <span className="capitalize font-semibold text-primary-700 dark:text-primary-300 text-sm">{item.template}</span>
                                            <span className="ml-2 text-slate-500 dark:text-slate-400 text-xs">({item.count})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Industry table */}
                {dashboardData.industryInsights?.length > 0 && (
                    <div className="card">
                        <h2 className="section-title mb-5">Detailed Industry Breakdown</h2>
                        <div className="overflow-x-auto">
                            <table className="table-base w-full">
                                <thead>
                                    <tr>
                                        {['Industry', 'Applications', 'Interviews', 'Offers', 'Success Rate'].map(h => (
                                            <th key={h} className="table-th">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.industryInsights.map((industry) => (
                                        <tr key={industry.industry} className="table-row">
                                            <td className="table-td font-semibold text-slate-800 dark:text-slate-200">{industry.industry}</td>
                                            <td className="table-td">{industry.applications}</td>
                                            <td className="table-td">{industry.interviews}</td>
                                            <td className="table-td">{industry.offers}</td>
                                            <td className="table-td">
                                                <span className={`font-bold ${parseFloat(industry.successRate) > 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {industry.successRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;

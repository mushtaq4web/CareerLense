import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];

const statusStyles = {
    Applied: { badge: 'badge-applied', dot: 'status-dot-applied', select: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
    Interview: { badge: 'badge-interview', dot: 'status-dot-interview', select: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
    Offer: { badge: 'badge-offer', dot: 'status-dot-offer', select: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
    Rejected: { badge: 'badge-rejected', dot: 'status-dot-rejected', select: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
};

// Company letter-avatar colors by status
const avatarColors = {
    Applied: 'from-blue-500 to-blue-600',
    Interview: 'from-amber-500 to-amber-600',
    Offer: 'from-emerald-500 to-emerald-600',
    Rejected: 'from-slate-400 to-slate-500',
};

const JobTracker = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const [formData, setFormData] = useState({
        company: '', role: '', status: 'Applied', notes: '',
        appliedDate: new Date().toISOString().split('T')[0],
        industry: '', responseDate: '',
    });

    useEffect(() => { fetchJobs(); }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => setFormData({
        company: '', role: '', status: 'Applied', notes: '',
        appliedDate: new Date().toISOString().split('T')[0],
        industry: '', responseDate: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.company || !formData.role) {
            toast.error('Company and role are required');
            return;
        }
        try {
            await api.post('/jobs', formData);
            toast.success('Job added!');
            setShowModal(false);
            resetForm();
            fetchJobs();
        } catch {
            toast.error('Failed to add job');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const job = jobs.find(j => j.id === id);
            await api.put(`/jobs/${id}`, { ...job, status: newStatus });
            toast.success('Status updated!');
            fetchJobs();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this job application?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success('Job deleted');
            setJobs(jobs.filter(j => j.id !== id));
        } catch {
            toast.error('Failed to delete job');
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || job.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interview: jobs.filter(j => j.status === 'Interview').length,
        offer: jobs.filter(j => j.status === 'Offer').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length,
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-start flex-wrap gap-4 mb-8 animate-fade-in">
                    <div>
                        <h1 className="page-title mb-1">Job Tracker</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Track every application in one place</p>
                    </div>
                    <button
                        id="add-job-btn"
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Job
                    </button>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-50 dark:bg-slate-800/60' },
                        { label: 'Applied', value: stats.applied, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'Interview', value: stats.interview, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                        { label: 'Offers', value: stats.offer, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                        { label: 'Rejected', value: stats.rejected, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                    ].map((s, i) => (
                        <div key={s.label} className={`rounded-2xl p-4 text-center border border-white/60 dark:border-slate-700/60 ${s.bg} animate-slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="Company or role…"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input-field"
                            >
                                <option value="All">All Statuses</option>
                                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length === 0 ? (
                    <div className="card text-center py-20 animate-scale-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-5 dark:from-primary-900/30 dark:to-accent-900/30">
                            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">No jobs found</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Start tracking your applications</p>
                        <button onClick={() => setShowModal(true)} className="btn-primary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add First Job
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredJobs.map((job, index) => {
                            const styles = statusStyles[job.status] || statusStyles.Applied;
                            const avatarGrad = avatarColors[job.status] || avatarColors.Applied;
                            const companyInitial = job.company?.charAt(0).toUpperCase() || '?';
                            return (
                                <div
                                    key={job.id}
                                    className="card hover:-translate-y-0.5 hover:shadow-md animate-slide-up py-4 px-5"
                                    style={{ animationDelay: `${index * 0.04}s` }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {/* Company avatar */}
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm`}>
                                                {companyInitial}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-2 mb-0.5">
                                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{job.company}</h3>
                                                    <span className={`badge ${styles.badge}`}>
                                                        <span className={`status-dot ${styles.dot}`} />
                                                        {job.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{job.role}</p>
                                                {job.industry && <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-0.5">{job.industry}</p>}
                                                {job.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-start gap-1"><span>📝</span>{job.notes}</p>}
                                                <div className="flex gap-3 mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                                                    <span>Applied {new Date(job.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    {job.responseDate && <span>· Response {new Date(job.responseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <select
                                                value={job.status}
                                                onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
                                                className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 outline-none cursor-pointer transition-all duration-150 ${styles.select}`}
                                            >
                                                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-white/60 dark:border-slate-700/80 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">Add New Job</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track a new application</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label">Company Name *</label>
                                <input type="text" value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="input-field" placeholder="Google, Stripe, Figma…" required />
                            </div>
                            <div>
                                <label className="label">Role *</label>
                                <input type="text" value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field" placeholder="Software Engineer" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Status</label>
                                    <select value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input-field">
                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Industry</label>
                                    <input type="text" value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="input-field" placeholder="FinTech, SaaS…" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Applied Date</label>
                                    <input type="date" value={formData.appliedDate}
                                        onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                                        className="input-field" />
                                </div>
                                <div>
                                    <label className="label">Response Date</label>
                                    <input type="date" value={formData.responseDate}
                                        onChange={(e) => setFormData({ ...formData, responseDate: e.target.value })}
                                        className="input-field" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Notes</label>
                                <textarea value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input-field resize-none" rows={3}
                                    placeholder="Referral, application link, next steps…" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary flex-1">Add Job</button>
                                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                                    className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobTracker;

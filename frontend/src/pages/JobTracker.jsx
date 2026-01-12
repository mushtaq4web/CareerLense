import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];

const JobTracker = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Applied',
        notes: '',
        appliedDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (error) {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.company || !formData.role) {
            toast.error('Company and role are required');
            return;
        }

        try {
            await api.post('/jobs', formData);
            toast.success('Job added successfully!');
            setShowModal(false);
            setFormData({
                company: '',
                role: '',
                status: 'Applied',
                notes: '',
                appliedDate: new Date().toISOString().split('T')[0],
            });
            fetchJobs();
        } catch (error) {
            toast.error('Failed to add job');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const job = jobs.find(j => j.id === id);
            await api.put(`/jobs/${id}`, { ...job, status: newStatus });
            toast.success('Status updated!');
            fetchJobs();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this job?')) {
            return;
        }

        try {
            await api.delete(`/jobs/${id}`);
            toast.success('Job deleted successfully');
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
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
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="page-title mb-2">Job Application Tracker</h1>
                        <p className="text-gray-600">Manage and track your job applications</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Job</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="card-gradient text-center">
                        <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                        <p className="text-sm text-gray-600 font-semibold">Total</p>
                    </div>
                    <div className="card-gradient text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.applied}</p>
                        <p className="text-sm text-gray-600 font-semibold">Applied</p>
                    </div>
                    <div className="card-gradient text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.interview}</p>
                        <p className="text-sm text-gray-600 font-semibold">Interview</p>
                    </div>
                    <div className="card-gradient text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.offer}</p>
                        <p className="text-sm text-gray-600 font-semibold">Offers</p>
                    </div>
                    <div className="card-gradient text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                        <p className="text-sm text-gray-600 font-semibold">Rejected</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field"
                                placeholder="Search by company or role..."
                            />
                        </div>
                        <div>
                            <label className="label">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input-field"
                            >
                                <option value="All">All</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No jobs found</h2>
                        <p className="text-gray-600 mb-6">Start tracking your job applications</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Your First Job</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job, index) => (
                            <div
                                key={job.id}
                                className="card hover:scale-[1.01] animate-slide-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800">{job.company}</h3>
                                                <p className="text-gray-600">{job.role}</p>
                                            </div>
                                            <span className={`badge badge-${job.status.toLowerCase()}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        {job.notes && (
                                            <p className="text-sm text-gray-600 mb-2">📝 {job.notes}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Applied: {new Date(job.appliedDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <select
                                            value={job.status}
                                            onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
                                            className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Job</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="input-field"
                                    placeholder="Google"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Role *</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field"
                                    placeholder="Software Engineer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="input-field"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Applied Date</label>
                                <input
                                    type="date"
                                    value={formData.appliedDate}
                                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="label">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Additional notes..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">
                                    Add Job
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobTracker;

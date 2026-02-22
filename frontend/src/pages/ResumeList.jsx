import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const templateMeta = {
    classic: { color: 'from-gray-500 to-gray-600', badge: 'bg-slate-100 text-slate-700 border-slate-200', bar: '#6b7280' },
    modern: { color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-50 text-blue-700 border-blue-200', bar: '#4f46e5' },
    minimal: { color: 'from-slate-400 to-slate-500', badge: 'bg-slate-50 text-slate-600 border-slate-200', bar: '#94a3b8' },
    professional: { color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: '#059669' },
    creative: { color: 'from-purple-500 to-pink-500', badge: 'bg-purple-50 text-purple-700 border-purple-200', bar: '#a855f7' },
};

const ResumeList = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { fetchResumes(); }, []);

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resumes');
            setResumes(response.data);
        } catch (error) {
            toast.error('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        try {
            await api.delete(`/resumes/${id}`);
            toast.success('Resume deleted');
            setResumes(resumes.filter(r => r.id !== id));
        } catch {
            toast.error('Failed to delete resume');
        }
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
                <div className="flex justify-between items-start flex-wrap gap-4 mb-10 animate-fade-in">
                    <div>
                        <h1 className="page-title mb-1">My Resumes</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} — managed &amp; ready
                        </p>
                    </div>
                    <button
                        id="create-resume-btn"
                        onClick={() => navigate('/resumes/create')}
                        className="btn-primary"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Resume
                    </button>
                </div>

                {resumes.length === 0 ? (
                    <div className="card text-center py-20 animate-scale-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-5 dark:from-primary-900/30 dark:to-accent-900/30">
                            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">No resumes yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Create your first professional resume to get started</p>
                        <button onClick={() => navigate('/resumes/create')} className="btn-primary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create First Resume
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {resumes.map((resume, index) => {
                            const meta = templateMeta[resume.template] || templateMeta.classic;
                            return (
                                <div
                                    key={resume.id}
                                    className="card group hover:-translate-y-1 hover:shadow-lg animate-slide-up p-0 overflow-hidden"
                                    style={{ animationDelay: `${index * 0.07}s` }}
                                >
                                    {/* Template color bar */}
                                    <div className={`h-2 w-full bg-gradient-to-r ${meta.color}`} />

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate mb-1">
                                                    {resume.title}
                                                </h3>
                                                <span className={`badge text-xs ${meta.badge}`}>
                                                    {resume.template}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                                {resume.content?.name}
                                            </p>
                                            <p className="text-xs">{resume.content?.jobTitle}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                                                Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/resumes/${resume.id}/preview`)}
                                                className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => navigate(`/resumes/edit/${resume.id}`)}
                                                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resume.id)}
                                                className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/35 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeList;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeList = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResumes();
    }, []);

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
        if (!confirm('Are you sure you want to delete this resume?')) {
            return;
        }

        try {
            await api.delete(`/resumes/${id}`);
            toast.success('Resume deleted successfully');
            setResumes(resumes.filter(r => r.id !== id));
        } catch (error) {
            toast.error('Failed to delete resume');
        }
    };

    const getTemplateBadgeColor = (template) => {
        const colors = {
            classic: 'bg-gray-100 text-gray-700',
            modern: 'bg-blue-100 text-blue-700',
            minimal: 'bg-slate-100 text-slate-700',
            professional: 'bg-emerald-100 text-emerald-700',
            creative: 'bg-purple-100 text-purple-700',
        };
        return colors[template] || colors.classic;
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="page-title mb-2">My Resumes</h1>
                        <p className="text-gray-600">Manage and preview your professional resumes</p>
                    </div>
                    <button
                        onClick={() => navigate('/resumes/create')}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Resume</span>
                    </button>
                </div>

                {resumes.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No resumes yet</h2>
                        <p className="text-gray-600 mb-6">Create your first professional resume to get started</p>
                        <button
                            onClick={() => navigate('/resumes/create')}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Create Your First Resume</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume, index) => (
                            <div
                                key={resume.id}
                                className="card hover:scale-105 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{resume.title}</h3>
                                        <span className={`badge ${getTemplateBadgeColor(resume.template)}`}>
                                            {resume.template}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    <p className="font-semibold">{resume.content.name}</p>
                                    <p>{resume.content.jobTitle}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/resumes/${resume.id}/preview`)}
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => navigate(`/resumes/edit/${resume.id}`)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(resume.id)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeList;

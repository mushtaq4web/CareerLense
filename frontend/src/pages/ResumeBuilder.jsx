import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const templates = [
    { id: 'classic', name: 'Classic', color: 'from-gray-600 to-gray-700', description: 'Traditional professional' },
    { id: 'modern', name: 'Modern', color: 'from-blue-600 to-indigo-600', description: 'Bold and contemporary' },
    { id: 'minimal', name: 'Minimal', color: 'from-slate-500 to-slate-600', description: 'Clean and simple' },
    { id: 'professional', name: 'Professional', color: 'from-emerald-600 to-teal-600', description: 'Corporate style' },
    { id: 'creative', name: 'Creative', color: 'from-purple-600 to-pink-600', description: 'Stylish and unique' },
];

const ResumeBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);

    const [formData, setFormData] = useState({
        title: '',
        name: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        summary: '',
        skills: '',
        experience: '',
        education: '',
        template: 'classic',
    });

    useEffect(() => {
        if (id) {
            fetchResume();
        }
    }, [id]);

    const fetchResume = async () => {
        try {
            const response = await api.get(`/resumes`);
            const resume = response.data.find(r => r.id === parseInt(id));

            if (resume) {
                setFormData({
                    title: resume.title,
                    ...resume.content,
                    template: resume.template,
                });
            } else {
                toast.error('Resume not found');
                navigate('/resumes');
            }
        } catch (error) {
            toast.error('Failed to load resume');
            navigate('/resumes');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Please enter a resume title');
            return;
        }

        if (!formData.name || !formData.email) {
            toast.error('Name and email are required');
            return;
        }

        setLoading(true);
        try {
            const { title, template, ...content } = formData;
            const payload = { title, content, template };

            if (id) {
                await api.put(`/resumes/${id}`, payload);
                toast.success('Resume updated successfully!');
            } else {
                await api.post('/resumes', payload);
                toast.success('Resume created successfully!');
            }

            navigate('/resumes');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save resume');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="page-title mb-2">
                        {id ? 'Edit Resume' : 'Create New Resume'}
                    </h1>
                    <p className="text-gray-600">Fill in your details to build a professional resume</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Resume Title */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Resume Title</h2>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Frontend Developer Resume"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-2">Give your resume a name to identify it later</p>
                    </div>

                    {/* Personal Information */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Job Title *</label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Software Engineer"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div>
                                <label className="label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="San Francisco, CA"
                                />
                            </div>
                            <div>
                                <label className="label">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="github.com/johndoe"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Summary</h2>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            className="input-field"
                            rows="4"
                            placeholder="A brief overview of your professional background and career objectives..."
                        />
                    </div>

                    {/* Skills */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
                        <textarea
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="input-field"
                            rows="3"
                            placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
                        />
                        <p className="text-sm text-gray-500 mt-2">Separate skills with commas</p>
                    </div>

                    {/* Experience */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Work Experience</h2>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="input-field"
                            rows="6"
                            placeholder="Senior Software Engineer at Tech Corp (2020-Present)&#10;- Led development of key features&#10;- Managed team of 5 developers&#10;&#10;Software Engineer at StartupXYZ (2018-2020)&#10;- Built scalable web applications"
                        />
                    </div>

                    {/* Education */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
                        <textarea
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            className="input-field"
                            rows="4"
                            placeholder="Bachelor of Science in Computer Science&#10;University Name, 2014-2018&#10;GPA: 3.8/4.0"
                        />
                    </div>

                    {/* Template Selection */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Template</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, template: template.id })}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${formData.template === template.id
                                        ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className={`w-full h-24 bg-gradient-to-br ${template.color} rounded-lg mb-3 shadow-md`}></div>
                                    <p className="font-semibold text-gray-800 text-sm">{template.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : id ? 'Update Resume' : 'Create Resume'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/resumes')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResumeBuilder;

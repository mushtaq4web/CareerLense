import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const templates = [
    { id: 'classic', name: 'Classic', color: 'from-gray-500 to-gray-600', description: 'Traditional & trusted' },
    { id: 'modern', name: 'Modern', color: 'from-blue-500 to-indigo-600', description: 'Bold & contemporary' },
    { id: 'minimal', name: 'Minimal', color: 'from-slate-400 to-slate-500', description: 'Clean & focused' },
    { id: 'professional', name: 'Professional', color: 'from-emerald-500 to-teal-600', description: 'Corporate style' },
    { id: 'creative', name: 'Creative', color: 'from-purple-500 to-pink-500', description: 'Stylish & unique' },
];

const SectionHeader = ({ icon, title }) => (
    <div className="section-header">
        <div className="section-icon">{icon}</div>
        <h2 className="section-title">{title}</h2>
    </div>
);

const ResumeBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);

    const [formData, setFormData] = useState({
        title: '', name: '', jobTitle: '', email: '', phone: '', location: '',
        linkedin: '', github: '', image: '', summary: '', skills: '', experience: '',
        education: '', template: 'classic',
    });
    const [aiRole, setAiRole] = useState('');
    const [aiExperience, setAiExperience] = useState('');
    const [aiJD, setAiJD] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => { if (id) fetchResume(); }, [id]);

    const fetchResume = async () => {
        try {
            const response = await api.get('/resumes');
            const resume = response.data.find(r => r.id === parseInt(id));
            if (resume) {
                setFormData({ title: resume.title, ...resume.content, template: resume.template });
            } else {
                toast.error('Resume not found');
                navigate('/resumes');
            }
        } catch {
            toast.error('Failed to load resume');
            navigate('/resumes');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    // const generateResumeAI = async () => {
    //     if (!aiRole || !aiJD) { toast.error('Role and Job Description required'); return; }
    //     setAiLoading(true);
    //     try {
    //         const res = await api.post('/ai/generate-resume', { role: aiRole, experience: aiExperience, jobDescription: aiJD });
    //         setFormData(prev => ({
    //             ...prev,
    //             summary: res.data.summary || prev.summary,
    //             skills: res.data.skills || prev.skills,
    //             experience: res.data.experience || prev.experience,
    //             education: res.data.education || prev.education,
    //         }));
    //         toast.success('AI Resume Generated!');
    //     } catch {
    //         toast.error('AI generation failed');
    //     } finally {
    //         setAiLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) { toast.error('Please enter a resume title'); return; }
        if (!formData.name || !formData.email) { toast.error('Name and email are required'); return; }
        setLoading(true);
        try {
            const { title, template, ...content } = formData;
            const payload = { title, content, template };
            if (id) {
                await api.put(`/resumes/${id}`, payload);
                toast.success('Resume updated!');
            } else {
                await api.post('/resumes', payload);
                toast.success('Resume created!');
            }
            navigate('/resumes');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save resume');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );

    const inputIcon = (icon) => (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
        </div>
    );

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 animate-fade-in">
                    <h1 className="page-title mb-1">{id ? 'Edit Resume' : 'Create Resume'}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Fill in your details to build a professional resume</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Resume Title */}
                    <div className="card animate-slide-up">
                        <SectionHeader
                            title="Resume Title"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                        />
                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                            className="input-field" placeholder="e.g., Frontend Developer Resume 2025" required />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">A name to identify this resume</p>
                    </div>

                    {/* AI Resume Generator */}
                    {/* <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-800/60 overflow-hidden animate-slide-up stagger-1">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 flex items-center gap-2">
                            <span className="text-white text-sm font-bold">✨ AI Resume Generator</span>
                            <span className="ml-auto text-xs text-primary-200 bg-white/15 px-2 py-0.5 rounded-full">Powered by AI</span>
                        </div>
                        <div className="p-6 bg-white/80 dark:bg-slate-900/70 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input type="text" placeholder="Job Role (e.g., Frontend Developer)"
                                    value={aiRole} onChange={(e) => setAiRole(e.target.value)} className="input-field" />
                                <input type="text" placeholder="Years of Experience (e.g., 2 years)"
                                    value={aiExperience} onChange={(e) => setAiExperience(e.target.value)} className="input-field" />
                            </div>
                            <textarea placeholder="Paste Job Description here…" value={aiJD}
                                onChange={(e) => setAiJD(e.target.value)} className="input-field resize-none" rows={3} />
                            <button type="button" onClick={generateResumeAI} disabled={aiLoading} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                                {aiLoading ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                                ) : <>✨ Generate Resume Using AI</>}
                            </button>
                        </div>
                    </div> */}

                    {/* Personal Information */}
                    <div className="card animate-slide-up stagger-2">
                        <SectionHeader
                            title="Personal Information"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    className="input-field" placeholder="Jane Doe" required />
                            </div>
                            <div>
                                <label className="label">Job Title *</label>
                                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange}
                                    className="input-field" placeholder="Software Engineer" required />
                            </div>
                            <div>
                                <label className="label">Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    className="input-field" placeholder="jane@example.com" required />
                            </div>
                            <div>
                                <label className="label">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="input-field" placeholder="+1 234 567 8900" />
                            </div>
                            <div>
                                <label className="label">Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange}
                                    className="input-field" placeholder="San Francisco, CA" />
                            </div>
                            <div>
                                <label className="label">LinkedIn</label>
                                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                                    className="input-field" placeholder="linkedin.com/in/janedoe" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="label">GitHub</label>
                                <input type="url" name="github" value={formData.github} onChange={handleChange}
                                    className="input-field" placeholder="github.com/janedoe" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="label">Profile Image (optional)</label>
                                <input type="file" accept="image/*" onChange={handleImageChange}
                                    className="input-field file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary-100 file:text-primary-700 file:font-semibold file:text-xs dark:file:bg-primary-900/40 dark:file:text-primary-300 cursor-pointer" />
                                {formData.image && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <img src={formData.image} alt="Profile preview" className="w-12 h-12 rounded-xl object-cover border-2 border-primary-100 dark:border-primary-800" />
                                        <button type="button" onClick={() => setFormData({ ...formData, image: '' })}
                                            className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove image</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="card animate-slide-up stagger-3">
                        <SectionHeader
                            title="Professional Summary"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>}
                        />
                        <textarea name="summary" value={formData.summary} onChange={handleChange}
                            className="input-field resize-none" rows={4}
                            placeholder="A brief overview of your professional background and career objectives…" />
                    </div>

                    {/* Skills */}
                    <div className="card animate-slide-up stagger-4">
                        <SectionHeader
                            title="Skills"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                        <textarea name="skills" value={formData.skills} onChange={handleChange}
                            className="input-field resize-none" rows={3}
                            placeholder="JavaScript, React, Node.js, Python, SQL, Git…" />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Separate skills with commas</p>
                    </div>

                    {/* Experience */}
                    <div className="card animate-slide-up stagger-5">
                        <SectionHeader
                            title="Work Experience"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        />
                        <textarea name="experience" value={formData.experience} onChange={handleChange}
                            className="input-field resize-none" rows={6}
                            placeholder={`Senior Software Engineer at Tech Corp (2020–Present)\n- Led development of key features\n- Managed team of 5 developers\n\nSoftware Engineer at StartupXYZ (2018–2020)\n- Built scalable web applications`} />
                    </div>

                    {/* Education */}
                    <div className="card animate-slide-up stagger-6">
                        <SectionHeader
                            title="Education"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}
                        />
                        <textarea name="education" value={formData.education} onChange={handleChange}
                            className="input-field resize-none" rows={4}
                            placeholder={`Bachelor of Science in Computer Science\nUniversity Name, 2014–2018\nGPA: 3.8/4.0`} />
                    </div>

                    {/* Template Selection */}
                    <div className="card animate-slide-up stagger-6">
                        <SectionHeader
                            title="Choose Template"
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" /></svg>}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, template: template.id })}
                                    className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left
                                                ${formData.template === template.id
                                            ? 'border-primary-500 shadow-md scale-[1.03] ring-2 ring-primary-500/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    {formData.template === template.id && (
                                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`w-full h-16 bg-gradient-to-br ${template.color} rounded-lg mb-2 shadow-sm`} />
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-xs">{template.name}</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 leading-tight">{template.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pb-8">
                        <button type="submit" disabled={loading}
                            className="btn-primary flex-1 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                            ) : id ? 'Update Resume' : 'Create Resume'}
                        </button>
                        <button type="button" onClick={() => navigate('/resumes')} className="btn-secondary px-8">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResumeBuilder;

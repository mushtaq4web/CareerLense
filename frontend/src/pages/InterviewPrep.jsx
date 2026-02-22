import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryIcons = {
    behavioral: '🧠',
    technical: '⚙️',
    company: '🏢',
};

const categoryTagStyles = {
    behavioral: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    technical: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    company: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
};

const categoryBorderColors = {
    behavioral: 'border-l-blue-400',
    technical: 'border-l-emerald-400',
    company: 'border-l-purple-400',
};

const InterviewPrep = () => {
    const [role, setRole] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['behavioral', 'technical', 'company']);
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/interview/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const generateQuestions = async () => {
        if (!role.trim()) { toast.error('Please enter a job role'); return; }
        setLoading(true);
        try {
            const response = await api.post('/interview/questions', {
                role: role.trim(),
                categories: selectedCategories,
            });
            setQuestions(response.data.questions);
            toast.success(`${response.data.questions.length} questions generated!`);
        } catch (error) {
            toast.error('Failed to generate questions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const filteredQuestions = filterCategory === 'all'
        ? questions
        : questions.filter(q => q.category === filterCategory);

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="page-title mb-1">Interview Prep</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Generate targeted questions tailored to your role and ace every interview
                    </p>
                </div>

                {/* Generator Card */}
                <div className="card mb-8 animate-slide-up">
                    <div className="section-header mb-6">
                        <div className="section-icon">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="section-title">Generate Questions</h2>
                    </div>

                    {/* Role Input */}
                    <div className="mb-6">
                        <label className="label">Job Role *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="input-field pl-10"
                                placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                                onKeyDown={(e) => e.key === 'Enter' && generateQuestions()}
                                id="interview-role-input"
                            />
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                            Press Enter or click Generate to get questions
                        </p>
                    </div>

                    {/* Category chips */}
                    <div className="mb-6">
                        <label className="label mb-3">Question Categories</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => toggleCategory(category.id)}
                                    className={`chip ${selectedCategories.includes(category.id) ? 'chip-active' : ''}`}
                                    id={`category-${category.id}`}
                                >
                                    <span>{categoryIcons[category.id] || '📋'}</span>
                                    <span>{category.name}</span>
                                    {selectedCategories.includes(category.id) && (
                                        <span className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        {categories.map(c => selectedCategories.includes(c.id) && (
                            <p key={c.id} className="hidden" />
                        ))}
                    </div>

                    <button
                        onClick={generateQuestions}
                        disabled={loading || !role.trim()}
                        id="generate-questions-btn"
                        className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate Interview Questions
                            </>
                        )}
                    </button>
                </div>

                {/* Questions */}
                {questions.length > 0 && (
                    <div className="card animate-scale-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                            <div>
                                <h2 className="section-title">
                                    Questions for <span className="text-gradient">{role}</span>
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{filteredQuestions.length} questions shown</p>
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="input-field max-w-[180px] text-sm"
                                id="filter-category-select"
                            >
                                <option value="all">All ({questions.length})</option>
                                <option value="behavioral">Behavioral ({questions.filter(q => q.category === 'behavioral').length})</option>
                                <option value="technical">Technical ({questions.filter(q => q.category === 'technical').length})</option>
                                <option value="company">Company Fit ({questions.filter(q => q.category === 'company').length})</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            {filteredQuestions.map((q, index) => (
                                <div
                                    key={q.id}
                                    className={`p-4 rounded-xl border border-l-4 border-slate-200/80 dark:border-slate-700/60 ${categoryBorderColors[q.category] || 'border-l-slate-400'}
                                                bg-white/60 dark:bg-slate-800/40 hover:bg-white/90 dark:hover:bg-slate-800/60 transition-colors duration-150`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-7 h-7 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center font-bold text-xs">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed mb-2">
                                                {q.question}
                                            </p>
                                            <span className={`badge text-xs ${categoryTagStyles[q.category] || ''}`}>
                                                {categoryIcons[q.category]} {q.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredQuestions.length === 0 && (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">
                                No questions in this category
                            </p>
                        )}

                        {/* Tips */}
                        <div className="mt-8 p-5 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/10 rounded-xl border border-primary-200/60 dark:border-primary-800/40">
                            <h3 className="font-bold text-primary-800 dark:text-primary-300 mb-3 flex items-center gap-2">
                                <span>💡</span> Interview Tips
                            </h3>
                            <ul className="space-y-1.5 text-sm text-primary-900 dark:text-primary-200/80">
                                {[
                                    'Practice answering each question out loud',
                                    'Use the STAR method for behavioral questions: Situation, Task, Action, Result',
                                    'Prepare specific examples from your own experience',
                                    'Research the company thoroughly before your interview',
                                    'Prepare thoughtful questions to ask the interviewer',
                                ].map((tip) => (
                                    <li key={tip} className="flex items-start gap-2">
                                        <span className="text-primary-500 mt-0.5">›</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {questions.length === 0 && !loading && (
                    <div className="card text-center py-16 animate-scale-in">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-xl font-display font-bold text-slate-700 dark:text-slate-300 mb-2">Ready to Prepare?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Enter a job role above and select question categories to get started
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewPrep;

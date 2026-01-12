const ProfessionalTemplate = ({ data }) => {
    const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="bg-white max-w-4xl mx-auto shadow-2xl flex" style={{ minHeight: '1056px' }}>
            {/* Sidebar */}
            <div className="w-1/3 bg-gradient-to-b from-emerald-700 to-teal-800 text-white p-8">
                <div className="mb-8">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-5xl font-bold text-emerald-700">
                            {data.name ? data.name.charAt(0) : 'Y'}
                        </span>
                    </div>
                </div>

                {/* Contact */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 border-b-2 border-white/30 pb-2">Contact</h3>
                    <div className="space-y-3 text-sm">
                        {data.email && <p className="break-words">✉ {data.email}</p>}
                        {data.phone && <p>☎ {data.phone}</p>}
                        {data.location && <p>📍 {data.location}</p>}
                        {data.linkedin && <p>🔗 LinkedIn</p>}
                        {data.github && <p>💻 GitHub</p>}
                    </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 border-b-2 border-white/30 pb-2">Skills</h3>
                        <div className="space-y-2">
                            {skills.map((skill, index) => (
                                <div key={index} className="text-sm">
                                    <p className="mb-1">{skill}</p>
                                    <div className="w-full bg-white/20 rounded-full h-1.5">
                                        <div className="bg-white h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name || 'Your Name'}</h1>
                    <h2 className="text-xl text-emerald-700 font-semibold">{data.jobTitle || 'Job Title'}</h2>
                </div>

                {/* Summary */}
                {data.summary && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-emerald-600 pl-3">
                            Professional Summary
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {data.experience && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-emerald-600 pl-3">
                            Work Experience
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.experience}</div>
                    </div>
                )}

                {/* Education */}
                {data.education && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-emerald-600 pl-3">
                            Education
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.education}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessionalTemplate;

const ModernTemplate = ({ data }) => {
    const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="bg-white max-w-4xl mx-auto shadow-2xl" style={{ minHeight: '1056px' }}>
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12">
                <h1 className="text-5xl font-bold mb-2">{data.name || 'Your Name'}</h1>
                <h2 className="text-2xl font-light mb-6">{data.jobTitle || 'Job Title'}</h2>

                <div className="flex flex-wrap gap-4 text-sm">
                    {data.email && <span>✉ {data.email}</span>}
                    {data.phone && <span>☎ {data.phone}</span>}
                    {data.location && <span>📍 {data.location}</span>}
                    {data.linkedin && <span>🔗 LinkedIn</span>}
                    {data.github && <span>💻 GitHub</span>}
                </div>
            </div>

            <div className="p-12">
                {/* Summary */}
                {data.summary && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-blue-600 mr-3"></span>
                            About Me
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-blue-600 mr-3"></span>
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-full shadow-md">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {data.experience && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-blue-600 mr-3"></span>
                            Experience
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.experience}</div>
                    </div>
                )}

                {/* Education */}
                {data.education && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-blue-600 mr-3"></span>
                            Education
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.education}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernTemplate;

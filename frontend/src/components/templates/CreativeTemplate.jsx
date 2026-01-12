const CreativeTemplate = ({ data }) => {
    const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-12 max-w-4xl mx-auto shadow-2xl" style={{ minHeight: '1056px' }}>
            {/* Header with creative design */}
            <div className="relative mb-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 -z-10"></div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    {data.name || 'Your Name'}
                </h1>
                <h2 className="text-2xl text-purple-700 font-semibold mb-6">{data.jobTitle || 'Job Title'}</h2>

                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    {data.email && (
                        <span className="px-3 py-1 bg-white rounded-full shadow-sm">✉ {data.email}</span>
                    )}
                    {data.phone && (
                        <span className="px-3 py-1 bg-white rounded-full shadow-sm">☎ {data.phone}</span>
                    )}
                    {data.location && (
                        <span className="px-3 py-1 bg-white rounded-full shadow-sm">📍 {data.location}</span>
                    )}
                    {data.linkedin && (
                        <span className="px-3 py-1 bg-white rounded-full shadow-sm">🔗 LinkedIn</span>
                    )}
                    {data.github && (
                        <span className="px-3 py-1 bg-white rounded-full shadow-sm">💻 GitHub</span>
                    )}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        ✨ About Me
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        🎯 Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-md transform hover:scale-105 transition-transform"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {data.experience && (
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        💼 Experience
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.experience}</div>
                </div>
            )}

            {/* Education */}
            {data.education && (
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        🎓 Education
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.education}</div>
                </div>
            )}
        </div>
    );
};

export default CreativeTemplate;

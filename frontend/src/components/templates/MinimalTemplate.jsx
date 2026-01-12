const MinimalTemplate = ({ data }) => {
    const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="bg-white p-16 max-w-4xl mx-auto shadow-2xl" style={{ minHeight: '1056px' }}>
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-tight">{data.name || 'Your Name'}</h1>
                <h2 className="text-xl text-gray-600 font-light mb-6">{data.jobTitle || 'Job Title'}</h2>

                <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-500">
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.location && <span>{data.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Skills
                    </h3>
                    <p className="text-gray-700">{skills.join(' • ')}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience && (
                <div className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Experience
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.experience}</div>
                </div>
            )}

            {/* Education */}
            {data.education && (
                <div className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Education
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data.education}</div>
                </div>
            )}
        </div>
    );
};

export default MinimalTemplate;

import React from "react";

const ClassicTemplate = ({ data }) => {
  const skills = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="bg-white p-10 max-w-4xl mx-auto shadow-lg"
      style={{ minHeight: "1056px", fontFamily: "Times New Roman, serif" }}
    >
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          {data.name || "Your Name"}
        </h1>
        <h2 className="text-xl text-gray-700 mt-1">
          {data.jobTitle || "Job Title"}
        </h2>

        <div className="text-sm text-gray-600 mt-2 space-x-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>| {data.phone}</span>}
          {data.location && <span>| {data.location}</span>}
        </div>

        <div className="text-sm text-gray-600 mt-1 space-x-3">
          {data.linkedin && <span>LinkedIn</span>}
          {data.github && <span>| GitHub</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <Section title="Summary">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {data.summary}
          </p>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <ul className="list-disc ml-5 space-y-1 text-gray-800">
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Experience */}
      {data.experience && (
        <Section title="Experience">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {data.experience}
          </p>
        </Section>
      )}

      {/* Education */}
      {data.education && (
        <Section title="Education">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {data.education}
          </p>
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ClassicTemplate;

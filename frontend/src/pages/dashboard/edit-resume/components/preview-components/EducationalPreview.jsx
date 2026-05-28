import React from "react";

function EducationalPreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#1e293b";

  // Hide section if no education data exists
  if (!resumeInfo?.education || resumeInfo?.education?.length === 0) return null;

  return (
    <div className="my-6">
      {/* 1. SECTION HEADER: Left-aligned for consistent document architecture */}
      <div className="mb-3">
        <h2
          className="font-bold text-[13px] uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Education
        </h2>
        <hr
          className="border-[1.5px] mt-1"
          style={{ borderColor: themeColor }}
        />
      </div>

      {/* 2. EDUCATION LIST */}
      <div className="space-y-4">
        {resumeInfo?.education?.map((education, index) => (
          <div key={index} className="leading-relaxed">
            {/* Institution & Date Row */}
            <div className="flex justify-between items-baseline">
              <h3
                className="text-[12px] font-bold uppercase tracking-tight text-slate-900"
              >
                {education?.universityName}
              </h3>
              <span className="text-[10px] font-bold text-slate-800">
                {education?.startDate} 
                {education?.startDate && education?.endDate ? " — " : ""} 
                {education?.endDate}
              </span>
            </div>

            {/* Degree, Major & Grade Row */}
            <div className="flex justify-between items-start text-[11px] font-medium text-slate-600">
              <span className="italic">
                {education?.degree}
                {education?.degree && education?.major ? " in " : ""}
                <span className="not-italic font-semibold text-slate-700">{education?.major}</span>
              </span>
              
              {education?.grade && (
                <span className="font-bold text-slate-800 ml-4">
                  {education?.gradeType || "Grade"}: {education?.grade}
                </span>
              )}
            </div>

            {/* 3. ADDITIONAL DETAILS (Optional) */}
            {education?.description && (
              <p className="text-[11px] mt-1.5 text-slate-700 leading-relaxed max-w-[95%]">
                {education?.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EducationalPreview;
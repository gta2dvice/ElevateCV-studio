import React from "react";

function ExperiencePreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#1e293b";

  // Hide section if no experience exists
  if (!resumeInfo?.experience || resumeInfo?.experience?.length === 0) return null;

  return (
    <div className="my-6">
      {/* 1. SECTION HEADER */}
      <div className="mb-3">
        <h2
          className="font-bold text-[13px] uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Professional Experience
        </h2>
        <hr
          className="border-[1.5px] mt-1"
          style={{ borderColor: themeColor }}
        />
      </div>

      {/* 2. EXPERIENCE LIST */}
      <div className="space-y-5">
        {resumeInfo?.experience?.map((experience, index) => (
          <div key={index} className="leading-relaxed">
            {/* Job Title & Date Row */}
            <div className="flex justify-between items-baseline">
              <h3
                className="text-[12px] font-bold uppercase tracking-tight"
                style={{ color: themeColor }}
              >
                {experience?.title}
              </h3>
              <span className="text-[10px] font-bold text-slate-800">
                {experience?.startDate} 
                {experience?.startDate ? " — " : ""} 
                {experience?.currentlyWorking ? "Present" : experience?.endDate}
              </span>
            </div>

            {/* Company & Location Row */}
            <div className="text-[11px] font-semibold text-slate-600 flex justify-between">
              <span>
                {experience?.companyName}
                {(experience?.city || experience?.state) && experience?.companyName ? ", " : ""}
                {experience?.city}{experience?.city && experience?.state ? ", " : ""} {experience?.state}
              </span>
            </div>

            {/* 3. ACHIEVEMENT SUMMARY - FIX APPLIED HERE */}
            <div
              // ADDED: 'whitespace-pre-wrap' to force HTML to respect \n line breaks
              className="text-[11px] mt-2 text-slate-800 preview-rich-text experience-bullet-list whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: experience?.workSummary }}
              style={{
                lineHeight: "1.6",
              }}
            />
          </div>
        ))}
      </div>

      {/* 4. ATS BULLET LOGIC */}
      <style jsx>{`
        .experience-bullet-list :global(ul) {
          list-style-type: disc;
          margin-left: 1.25rem;
          margin-top: 0.25rem;
        }
        .experience-bullet-list :global(li) {
          margin-bottom: 0.3rem;
          padding-left: 0.2rem;
        }
      `}</style>
    </div>
  );
}

export default ExperiencePreview;
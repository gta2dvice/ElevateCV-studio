import React from "react";

function SkillsPreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#1e293b";

  if (!resumeInfo?.skills || resumeInfo?.skills?.length === 0) return null;

  return (
    <div className="my-6">
      {/* 1. SECTION HEADER: Left-aligned for universal professional standard */}
      <div className="mb-3">
        <h2
          className="font-bold text-[13px] uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Skills & Expertise
        </h2>
        <hr
          className="border-[1.5px] mt-1"
          style={{ borderColor: themeColor }}
        />
      </div>

      {/* 2. SKILLS GRID: Optimized for human scanning and machine parsing */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-3 mt-4">
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            {/* Skill Name: Uses bold weight for visual hierarchy */}
            <h2 className="text-[11px] font-semibold text-slate-800">
              {skill.name}
            </h2>

            {/* Proficiency Container */}
            {skill.name && (
              <div className="flex items-center gap-2">
                {/* Visual Bar: High-end look for human recruiters */}
                <div className="h-1.5 bg-slate-100 w-24 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      backgroundColor: themeColor,
                      width: (skill?.rating || 0) * 20 + "%",
                    }}
                  />
                </div>
                
                {/* 3. ATS Fallback: Subtle text indicator ensures parsers understand the level */}
                {/* <span className="sr-only">Proficiency: {skill?.rating}/5</span> */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;
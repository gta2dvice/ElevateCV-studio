import React from "react";

function PersonalDetailPreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#1e293b";

  return (
    <div className="text-center">
      {/* 1. MASTER IDENTITY: High Authority Header */}
      <h1
        className="font-black text-3xl uppercase tracking-tighter leading-none"
        style={{ color: themeColor }}
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h1>

      {/* 2. PROFESSIONAL TARGET: Standardized for all industries */}
      <p className="text-[13px] font-bold text-slate-800 mt-2 uppercase tracking-[0.2em]">
        {resumeInfo?.jobTitle || "Professional Title"}
      </p>

      {/* 3. CONTACT & LINKS: Optimized for ATS extraction and human scan */}
      <div className="mt-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[10.5px] font-medium text-slate-600">
        {resumeInfo?.address && (
          <span className="flex items-center">{resumeInfo?.address}</span>
        )}
        
        {resumeInfo?.phone && (
          <span className="flex items-center gap-1.5">
            {resumeInfo?.address && <span className="text-slate-300">|</span>}
            {resumeInfo?.phone}
          </span>
        )}

        {resumeInfo?.email && (
          <span className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="underline decoration-slate-200 underline-offset-2">
              {resumeInfo?.email}
            </span>
          </span>
        )}

        {/* 4. PROFESSIONAL PORTFOLIO LINKS */}
        {resumeInfo?.linkedin && (
          <span className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-800">LinkedIn</span>
          </span>
        )}

        {resumeInfo?.github && (
          <span className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-800">GitHub</span>
          </span>
        )}
      </div>

      {/* 5. THEME SEPARATOR: Clean anchor for the document body */}
      <hr
        className="border-[1.5px] mt-5 mb-2"
        style={{ borderColor: themeColor }}
      />
    </div>
  );
}

export default PersonalDetailPreview;
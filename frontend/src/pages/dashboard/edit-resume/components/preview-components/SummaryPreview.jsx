import React from "react";

function SummaryPreview({ resumeInfo }) {
  // Defensive check: If no summary exists, hide the entire section
  if (!resumeInfo?.summary) return null;

  return (
    <div className="mt-5">
      {/* 1. SECTION HEADING: Essential for ATS to identify the content block */}
      <h2 
        className="text-[13px] font-bold uppercase tracking-wider mb-2"
        style={{
          color: resumeInfo?.themeColor || "#1e293b",
          borderBottom: `1.5px solid ${resumeInfo?.themeColor || "#e2e8f0"}`
        }}
      >
        Professional Summary
      </h2>

      {/* 2. SUMMARY CONTENT: Optimized for readability and parsing */}
      <p 
        className="text-[11px] leading-[1.6] text-slate-900 font-normal"
        style={{
          // We avoid 'text-justify' here because it can create awkward gaps 
          // called "rivers," which reduce readability for human eyes.
          textAlign: "left", 
          // Ensure standard system fonts are used in the parent wrapper
        }}
      >
        {resumeInfo?.summary}
      </p>
    </div>
  );
}

export default SummaryPreview;
import React from "react";

/**
 * ProjectPreview Component
 * Renders technical projects with dynamic theme coloring and 
 * support for multi-line AI descriptions.
 */
function ProjectPreview({ resumeInfo }) {
  // Define themeColor at the top level of the component
  const themeColor = resumeInfo?.themeColor || "#6366f1";

  // Hide the entire section if no projects exist
  if (!resumeInfo?.projects || resumeInfo?.projects?.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      {/* SECTION HEADER */}
      <div className="mb-3">
        <h2
          className="font-bold text-[13px] uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Projects
        </h2>
        <hr
          className="border-[1.5px] mt-1"
          style={{ borderColor: themeColor }}
        />
      </div>

      {/* PROJECT LIST */}
      <div className="space-y-5">
        {resumeInfo.projects.map((project, index) => (
          <div key={index} className="leading-relaxed">
            {/* Project Title and Link */}
            <div className="font-bold flex justify-between items-baseline">
              <h3
                className="text-[12px] font-bold"
                style={{ color: themeColor }}
              >
                {/* ALIGNMENT FIX: Matches 'title' key from Projects.jsx */}
                {project?.title}
              </h3>
              {project?.link && (
                <span className="text-[9px] text-slate-400 font-medium">
                  {project.link}
                </span>
              )}
            </div>

            {/* Tools & Technologies */}
            {/* ALIGNMENT FIX: Matches 'tools' key from Projects.jsx */}
            {project?.tools && (
              <div className="text-[11px] font-semibold text-slate-700 mt-0.5">
                <span className="italic font-medium text-slate-500">Core Tools: </span>
                {project.tools.split(",").map((tech, i) => (
                  <React.Fragment key={i}>
                    {tech.trim()}
                    {i < project.tools.split(",").length - 1 ? " | " : ""}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Project Description/Impact */}
            {/* ALIGNMENT FIX: Matches 'description' key from Projects.jsx */}
            <div
              className="text-[11px] mt-2 text-slate-800 whitespace-pre-wrap custom-bullet-list"
              dangerouslySetInnerHTML={{ __html: project?.description }}
              style={{
                lineHeight: "1.6",
              }}
            />
          </div>
        ))}
      </div>

      {/* Internal CSS for consistent rich-text rendering */}
      <style jsx>{`
        .custom-bullet-list :global(ul) {
          list-style-type: disc;
          margin-left: 1.2rem;
        }
        .custom-bullet-list :global(li) {
          margin-bottom: 0.2rem;
        }
      `}</style>
    </div>
  );
}

// CRITICAL EXPORT: Prevents "does not provide an export named default" error
export default ProjectPreview;
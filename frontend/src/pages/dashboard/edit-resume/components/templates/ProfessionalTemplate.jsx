import React from 'react';
import PersonalDetailPreview from '../preview-components/PersonalDeatailPreview';
import SummaryPreview from '../preview-components/SummaryPreview';
import ExperiencePreview from '../preview-components/ExperiencePreview';
import EducationalPreview from '../preview-components/EducationalPreview';
import SkillsPreview from '../preview-components/SkillsPreview';
import ProjectPreview from '../preview-components/ProjectPreview';;

function ProfessionalTemplate({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#000";

  return (
    <div className="bg-white h-full min-h-[1100px] shadow-2xl flex flex-col">
      {/* Header Banner */}
      <div 
        className="p-8 text-white" 
        style={{ backgroundColor: themeColor }}
      >
        <h2 className="text-3xl font-bold uppercase tracking-wider">
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        <p className="text-md opacity-90 font-medium">{resumeInfo?.jobTitle}</p>
      </div>

      <div className="flex flex-1">
        {/* Sidebar (Left) */}
        <div className="w-[35%] bg-slate-50 p-6 border-r border-slate-100">
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black uppercase mb-3" style={{ color: themeColor }}>Contact</h3>
              <div className="text-[11px] space-y-1 text-slate-600">
                <p>{resumeInfo?.address}</p>
                <p>{resumeInfo?.phone}</p>
                <p className="break-all">{resumeInfo?.email}</p>
              </div>
            </section>

            <SkillsPreview resumeInfo={resumeInfo} />
            <EducationalPreview resumeInfo={resumeInfo} />
          </div>
        </div>

        {/* Main Content (Right) */}
        <div className="flex-1 p-8">
          <div className="space-y-8">
            <section>
               <SummaryPreview resumeInfo={resumeInfo} />
            </section>
            
            <ExperiencePreview resumeInfo={resumeInfo} />
            <ProjectPreview resumeInfo={resumeInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalTemplate;
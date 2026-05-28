import React from 'react';
import PersonalDetailPreview from '../preview-components/PersonalDeatailPreview';
import SummaryPreview from '../preview-components/SummaryPreview';
import ExperiencePreview from '../preview-components/ExperiencePreview';
import EducationalPreview from '../preview-components/EducationalPreview';
import SkillsPreview from '../preview-components/SkillsPreview';
import ProjectPreview from '../preview-components/ProjectPreview';

function ModernTemplate({ resumeInfo }) {
  return (
    <div 
      className="p-10 bg-white h-full shadow-2xl"
      style={{ borderTop: `20px solid ${resumeInfo?.themeColor}` }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      
      <div className="mt-6">
        <SummaryPreview resumeInfo={resumeInfo} />
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <ExperiencePreview resumeInfo={resumeInfo} />
        <ProjectPreview resumeInfo={resumeInfo} />
        <EducationalPreview resumeInfo={resumeInfo} />
        <SkillsPreview resumeInfo={resumeInfo} />
      </div>
    </div>
  );
}

export default ModernTemplate;
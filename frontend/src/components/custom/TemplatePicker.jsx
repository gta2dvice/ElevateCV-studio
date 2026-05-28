import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layout, Columns, Rows, CheckCircle2, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI"; // ALIGNMENT: Added API call
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const templates = [
  // ALIGNMENT FIX: Template IDs matched to Mongoose expected strings
  {
    id: 'ModernTemplate', 
    name: 'Modern Classic',
    description: 'A clean, standard look that works for every industry.',
    icon: <Rows className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    id: 'ProfessionalTemplate',
    name: 'Executive Edge',
    description: 'A polished two-column style to highlight key expertise.',
    icon: <Columns className="w-5 h-5 sm:w-6 sm:h-6" />,
  }
];

function TemplatePicker() {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  
  // ALIGNMENT FIX: Check templateName instead of templateId
  const currentTemplate = resumeInfo?.templateName || 'ModernTemplate';

  const handleTemplateSelect = async (id) => {
    // 1. Instantly update Redux for immediate UI change
    const updatedResume = {
      ...resumeInfo,
      templateName: id // ALIGNMENT: Matches Schema
    };
    dispatch(addResumeData(updatedResume));

    // 2. Sync preference to the database
    if (resume_id) {
      try {
        await updateThisResume(resume_id, updatedResume);
        toast.success("Architecture Style Updated");
      } catch (error) {
        toast.error("Failed to sync your preferences");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto flex gap-2 rounded-2xl border-purple-100 text-purple-600 font-bold hover:bg-purple-50 h-11 px-6 shadow-sm transition-all active:scale-95">
          <Layout className="w-4 h-4" /> 
          <span className="text-xs sm:text-sm">Change Style</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-2xl bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-slate-900">
              Select Your <span className="text-purple-600">Style</span>
            </DialogTitle>
          </div>
          <p className="text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-widest leading-tight">
            Choose the best visual path for your career journey
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {templates.map((template) => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTemplateSelect(template.id)}
              className={`p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col items-center text-center ${
                currentTemplate === template.id 
                ? 'border-purple-600 bg-purple-50/30' 
                : 'border-slate-50 bg-slate-50/50 hover:border-purple-200 hover:bg-white'
              }`}
            >
              {currentTemplate === template.id && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-purple-600 rounded-full p-1 shadow-lg shadow-purple-200">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
              
              <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 transition-all shadow-sm ${
                currentTemplate === template.id 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-slate-400 group-hover:text-purple-600'
              }`}>
                {template.icon}
              </div>
              
              <h3 className={`font-black uppercase text-xs sm:text-sm tracking-tight ${
                currentTemplate === template.id ? 'text-purple-900' : 'text-slate-900'
              }`}>
                {template.name}
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-2 leading-relaxed">
                {template.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-end">
           <Button 
             className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-10 h-12 bg-slate-900 text-white font-bold uppercase text-[10px] sm:text-xs tracking-widest shadow-xl shadow-slate-200 hover:bg-purple-600 transition-all"
             onClick={() => document.querySelector('[data-radix-collection-item]')?.click() || 
                             document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
           >
             Confirm Selection
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplatePicker;
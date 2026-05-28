import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, GraduationCap, Plus, Minus, Calendar, Award, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion, AnimatePresence } from "framer-motion";

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

function Education({ resumeInfo, enanbledNext }) {
  const [educationalList, setEducationalList] = useState(
    resumeInfo?.education?.length > 0 ? resumeInfo.education : [{ ...formFields }]
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false); // Renamed to isSaving for clarity

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationalList }));
  }, [educationalList]);

  const AddNewEducation = () => {
    setEducationalList([...educationalList, { ...formFields }]);
  };

  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList(educationalList.slice(0, -1));
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationalList];
    list[index] = { ...list[index], [name]: value };
    setEducationalList(list);
  };

  // --- ALIGNED SAVE LOGIC ---
  const onSave = async () => {
    setIsSaving(true);
    
    // Fix: Send the properly structured object matching your schema
    const updatedResume = { ...resumeInfo, education: educationalList };
    
    if (resume_id) {
      try {
        const result = await updateThisResume(resume_id, updatedResume);
        if (result && (result.success || result.statusCode === 200)) {
          toast.success("Academic achievements synchronized!");
          if (enanbledNext) enanbledNext(true);
        }
      } catch (error) {
        toast.error(error?.message || "Failed to save education details.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white shadow-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 mt-6 md:mt-10 relative">
      {/* 1. HEADER */}
      <div className="mb-8 md:mb-10 flex items-center gap-3">
        <div className="p-2 md:p-2.5 bg-purple-600 rounded-xl md:rounded-2xl shadow-lg shadow-purple-100">
          <GraduationCap className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h2 className="font-black text-lg md:text-2xl text-slate-900 tracking-tighter uppercase leading-none">
            Academic <span className="text-purple-600">History</span>
          </h2>
          <p className="hidden sm:block text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1.5 opacity-60">
            Showcase your qualifications and honors
          </p>
        </div>
      </div>

      {/* 2. EDUCATION LIST */}
      <div className="space-y-6">
        <AnimatePresence>
          {educationalList.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-4 md:space-y-6 relative hover:bg-white hover:border-purple-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-purple-600 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-purple-100 shadow-sm">
                  Degree {index + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="col-span-full space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institution Name</label>
                  <Input
                    name="universityName"
                    placeholder="Ex: University of Rajasthan"
                    className="h-10 md:h-12 rounded-xl border-slate-100 bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-bold text-xs md:text-sm text-slate-700"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.universityName}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Degree Type</label>
                  <Input
                    name="degree"
                    placeholder="Ex: Bachelor's"
                    className="h-10 md:h-12 rounded-xl border-slate-100 bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-semibold text-xs md:text-sm"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.degree}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Field of Study</label>
                  <Input
                    name="major"
                    placeholder="Ex: Computer Science"
                    className="h-10 md:h-12 rounded-xl border-slate-100 bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-semibold text-xs md:text-sm"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.major}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                    <Calendar className="w-3 h-3 text-purple-600" /> Start Date
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    className="h-10 md:h-12 rounded-xl border-slate-100 bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all text-[10px] md:text-xs"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.startDate}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                    <Calendar className="w-3 h-3 text-purple-600" /> Graduation Date
                  </label>
                  <Input
                    type="date"
                    name="endDate"
                    className="h-10 md:h-12 rounded-xl border-slate-100 bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all text-[10px] md:text-xs"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.endDate}
                  />
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                    <Award className="w-3 h-3 text-purple-600" /> Result / Grade
                  </label>
                  <div className="flex gap-2 md:gap-3">
                    <select
                      name="gradeType"
                      className="bg-white border border-slate-100 text-slate-700 text-[10px] md:text-xs font-bold rounded-xl px-2 md:px-4 h-10 md:h-12 focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 outline-none transition-all shadow-sm"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.gradeType}
                    >
                      <option value="CGPA">CGPA</option>
                      <option value="GPA">GPA</option>
                      <option value="Percentage">%</option>
                    </select>
                    <Input
                      name="grade"
                      placeholder="Ex: 9.2"
                      className="h-10 md:h-12 rounded-xl border-slate-100 bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all flex-1 font-bold text-xs md:text-sm"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.grade}
                    />
                  </div>
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Key Honors & Awards</label>
                  <Textarea
                    name="description"
                    placeholder="Describe any scholarships or research..."
                    className="rounded-xl md:rounded-2xl border-slate-100 bg-white min-h-[80px] md:min-h-[100px] p-4 focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all text-xs md:text-sm leading-relaxed whitespace-pre-wrap"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.description}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. FOOTER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-50 gap-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={AddNewEducation}
            className="flex-1 sm:flex-none h-11 md:h-12 rounded-xl md:rounded-2xl border-slate-100 bg-white text-slate-500 hover:bg-slate-50 font-bold px-4 md:px-6 flex items-center gap-2 text-[10px] md:text-xs uppercase"
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
          <Button
            variant="ghost"
            onClick={RemoveEducation}
            className="flex-1 sm:flex-none h-11 md:h-12 rounded-xl md:rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold px-4 md:px-6 text-[10px] md:text-xs uppercase"
            disabled={educationalList.length <= 1}
          >
            <Minus className="w-4 h-4" /> Remove
          </Button>
        </div>
        
        <Button 
          disabled={isSaving} 
          onClick={onSave}
          className="w-full sm:w-auto bg-slate-900 hover:bg-purple-600 text-white rounded-xl md:rounded-[1.25rem] px-10 md:px-12 h-12 md:h-14 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isSaving ? <LoaderCircle className="animate-spin w-5 h-5" /> : (
             <>
               <Save className="w-4 h-4" />
               Save
             </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Education;
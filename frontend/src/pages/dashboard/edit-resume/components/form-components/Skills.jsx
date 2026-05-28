import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { LoaderCircle, Cpu, Plus, Minus, Wand2, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Skills({ resumeInfo, enanbledNext }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  const [isSaving, setIsSaving] = useState(false);
  const [skillsList, setSkillsList] = useState(
    resumeInfo?.skills?.length > 0 ? resumeInfo.skills : [{ name: "", rating: 0 }]
  );
  
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Fetch AI suggestions based on Job Title and Description
  useEffect(() => {
   const fetchAiSkills = async () => {
  if (!resumeInfo?.jobDescription && !resumeInfo?.jobTitle) return;
  
  setLoadingSuggestions(true);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_URL}/api/ai/suggest-skills`, 
      {
        jobTitle: resumeInfo?.jobTitle,
        jobDescription: resumeInfo?.jobDescription
      },
      { withCredentials: true } // CRITICAL: This allows the session cookie to be sent
    );
    
    if (res.data?.success) {
      setAiSuggestions(res.data.data);
    }
  } catch (error) {
    console.error("AI Skill fetch failed", error);
  } finally {
    setLoadingSuggestions(false);
  }
};

    fetchAiSkills();
  }, [resumeInfo?.jobDescription, resumeInfo?.jobTitle]);

  const syncToRedux = (newList) => {
    dispatch(addResumeData({ ...resumeInfo, skills: newList }));
  };

  const handleChange = (index, key, value) => {
    const list = [...skillsList];
    list[index] = { ...list[index], [key]: value };
    setSkillsList(list);
    syncToRedux(list);
  };

  const AddNewSkills = (skillName = "") => {
    if (skillName && skillsList.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      return toast.info(`${skillName} is already added.`);
    }
    const newList = [...skillsList, { name: skillName, rating: 0 }];
    setSkillsList(newList);
    syncToRedux(newList);
  };

  const RemoveSkills = () => {
    if (skillsList.length > 1) {
      const newList = skillsList.slice(0, -1);
      setSkillsList(newList);
      syncToRedux(newList);
    }
  };

  const onSave = async () => {
    setIsSaving(true);
    const updatedResume = { ...resumeInfo, skills: skillsList };
    
    if (resume_id) {
      try {
        const result = await updateThisResume(resume_id, updatedResume);
        if (result && (result.success || result.statusCode === 200)) {
          toast.success("Expertise profile synchronized!");
          if (enanbledNext) enanbledNext(true);
        }
      } catch (error) {
        toast.error(error?.message || "Failed to sync expertise.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white shadow-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 mt-6 relative">
      
      {/* AI SUGGESTION PANEL */}
      <div className="mb-10 p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-200">
                Tailored for your Target Role
              </h3>
            </div>
            {loadingSuggestions && <LoaderCircle className="animate-spin w-4 h-4 text-purple-400" />}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((skill, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => AddNewSkills(skill)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-white hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2"
                >
                  <Plus className="w-3 h-3" /> {skill}
                </motion.button>
              ))
            ) : (
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] opacity-60">
                {resumeInfo?.jobDescription 
                  ? "Analyzing job context..." 
                  : "Add a Job Description in the Forge Panel for AI suggestions."}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="p-2.5 bg-purple-600 rounded-2xl shadow-lg shadow-purple-100 shrink-0">
          <Cpu className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="font-black text-2xl text-slate-900 uppercase tracking-tighter leading-none">
            Skills & <span className="text-purple-600">Expertise</span>
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {skillsList.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-8 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100"
            >
              <div className="md:col-span-7 space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Competency
                </label>
                <Input
                  className="rounded-xl border-slate-100 bg-white h-12 text-sm font-bold text-slate-700"
                  placeholder="Ex: Project Management"
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </div>

              <div className="md:col-span-5 flex flex-col items-end justify-center gap-2.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">
                  Mastery Level
                </label>
                <div className="bg-white p-2.5 px-5 rounded-xl border border-slate-100 shadow-sm">
                  <Rating
                    style={{ maxWidth: 100 }}
                    value={item.rating}
                    onChange={(v) => handleChange(index, "rating", v)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-slate-50 gap-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => AddNewSkills()}
            className="flex-1 sm:flex-none rounded-xl border-slate-200 text-slate-600 font-bold h-12 px-6 flex items-center gap-2 text-xs"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </Button>
          <Button
            variant="ghost"
            onClick={RemoveSkills}
            className="flex-1 sm:flex-none rounded-xl text-slate-400 hover:text-red-500 font-bold h-12 px-6 text-xs"
            disabled={skillsList.length <= 1}
          >
            <Minus className="w-4 h-4" /> Remove
          </Button>
        </div>
        
        <Button 
          disabled={isSaving} 
          onClick={onSave}
          className="w-full sm:w-auto bg-slate-900 hover:bg-purple-600 text-white rounded-xl px-12 h-14 font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3"
        >
          {isSaving ? <LoaderCircle className="animate-spin w-5 h-5" /> : <><Save className="w-4 h-4" /> Sync Expertise</>}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
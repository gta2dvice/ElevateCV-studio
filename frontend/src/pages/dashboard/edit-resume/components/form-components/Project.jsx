import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Plus, Trash2, FolderGit2, Save, Wrench } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"; // ADDED: For DB Save
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI"; // ADDED: For DB Save
import { motion, AnimatePresence } from "framer-motion";

const initialProject = {
  title: "",
  link: "",
  tools: "",
  description: "" 
};

const TECH_STACK_DB = [
  "React", "Node.js", "MongoDB", "Express", "Tailwind CSS", "JavaScript", 
  "TypeScript", "Python", "AWS", "Docker", "Git", "Next.js", "PostgreSQL", 
  "MySQL", "Firebase", "Redux", "Framer Motion", "GraphQL"
];

function Projects({ resumeInfo }) {
  const { resume_id } = useParams(); // Extract ID
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ADDED: Save state
  const [projectList, setProjectList] = useState([initialProject]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (resumeInfo?.projects?.length > 0) {
      setProjectList(resumeInfo.projects);
    }
  }, [resumeInfo]);

  const handleToolInput = (index, value) => {
    handleChange(index, { target: { name: "tools", value } });
    const currentTools = value.split(",");
    const lastWord = currentTools[currentTools.length - 1].trim().toLowerCase();

    if (lastWord.length > 0) {
      const matches = TECH_STACK_DB.filter(tech => 
        tech.toLowerCase().includes(lastWord) && !value.toLowerCase().includes(tech.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setActiveSuggestionIndex(matches.length > 0 ? index : null);
    } else {
      setActiveSuggestionIndex(null);
    }
  };

  const applySuggestion = (index, suggestion) => {
    const currentTools = projectList[index].tools.split(",");
    currentTools.pop(); 
    const newToolString = [...currentTools, suggestion].filter(t => t.trim() !== "").join(", ") + ", ";
    
    handleChange(index, { target: { name: "tools", value: newToolString } });
    setActiveSuggestionIndex(null); 
  };

  const handleGenerateAI = async (index) => {
    const title = projectList[index]?.title;
    if (!title) return toast.error("Enter a Project Title first!");

    setLoading(true);
    try {
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const baseUrl = rawUrl.replace(/\/+$/, "");

      const response = await axios.post(`${baseUrl}/api/ai/generate-content`, {
        context: `Generate 3 high-impact bullet points describing a software project named ${title}. Focus on problem-solving, architecture, and impact. Do not use asterisks. Separate each point with a new line.`,
        promptType: 'experience' 
      }, { withCredentials: true });

      let aiContent = response.data.data.content; 
      
      if (typeof aiContent === "string") {
        let cleanText = aiContent.replace(/\*\*/g, ""); 
        const bulletArray = cleanText.split(/\n|\* | - /).map(line => line.trim()).filter(line => line.length > 5);
        aiContent = bulletArray.map(line => `• ${line}`).join("\n\n");
      }

      const newEntries = [...projectList];
      newEntries[index] = { ...newEntries[index], description: aiContent };
      
      setProjectList(newEntries);
      dispatch(addResumeData({ ...resumeInfo, projects: newEntries }));
      toast.success("Project Impact Synchronized!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "AI service is busy.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...projectList];
    newEntries[index] = { ...newEntries[index], [name]: value };
    setProjectList(newEntries);
    dispatch(addResumeData({ ...resumeInfo, projects: newEntries }));
  };

  const addNewProject = () => {
    const newList = [...projectList, initialProject];
    setProjectList(newList);
    dispatch(addResumeData({ ...resumeInfo, projects: newList }));
  };

  const removeProject = (index) => {
    const newEntries = projectList.filter((_, i) => i !== index);
    setProjectList(newEntries);
    dispatch(addResumeData({ ...resumeInfo, projects: newEntries }));
  };

  // --- THE NEW WORKING SAVE LOGIC ---
  const onSave = async () => {
    setIsSaving(true);
    try {
      const updatedResume = { ...resumeInfo, projects: projectList };
      dispatch(addResumeData(updatedResume));
      
      const result = await updateThisResume(resume_id, updatedResume);
      
      if (result && (result.success || result.statusCode === 200)) {
        toast.success(result.message || "Projects synchronized with database!");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error?.message || "Failed to save projects.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl mt-6 md:mt-10 relative">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-2 bg-purple-600 rounded-xl shrink-0">
          <FolderGit2 className="text-white w-4 h-4 md:w-5 md:h-5" />
        </div>
        <div>
          <h2 className="font-black text-lg md:text-2xl text-slate-900 uppercase tracking-tighter leading-none">
            Technical <span className="text-purple-600">Projects</span>
          </h2>
        </div>
      </div>

      <AnimatePresence>
        {projectList.map((item, index) => (
          <motion.div key={index} className="p-4 md:p-8 rounded-[1.2rem] md:rounded-[2rem] bg-slate-50/50 border border-slate-100 mb-6 relative group">
            {projectList.length > 1 && (
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl" onClick={() => removeProject(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Name</label>
                <Input name="title" placeholder="Ex: CareerForge AI" value={item.title} onChange={(e) => handleChange(index, e)} className="h-10 md:h-12 rounded-xl bg-white font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Live URL / GitHub</label>
                <Input name="link" placeholder="Ex: github.com/pratik/project" value={item.link} onChange={(e) => handleChange(index, e)} className="h-10 md:h-12 rounded-xl bg-white font-bold" />
              </div>

              <div className="col-span-full space-y-2 relative">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> Tools & Technologies
                </label>
                <Input 
                  name="tools" 
                  autoComplete="off"
                  placeholder="Ex: React, Node.js, Tailwind..." 
                  value={item.tools} 
                  onChange={(e) => handleToolInput(index, e.target.value)} 
                  onBlur={() => setTimeout(() => setActiveSuggestionIndex(null), 200)} 
                  className="h-10 md:h-12 rounded-xl bg-white font-bold" 
                />
                
                {activeSuggestionIndex === index && filteredSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-2xl p-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, i) => (
                      <div 
                        key={i} 
                        onClick={() => applySuggestion(index, suggestion)}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-purple-600 hover:text-white transition-colors"
                      >
                        + {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-full space-y-2 mt-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Impact & Description</label>
                  <Button variant="ghost" size="sm" onClick={() => handleGenerateAI(index)} disabled={loading} className="text-purple-600 font-bold hover:bg-purple-50 flex gap-2 rounded-lg h-7 px-2">
                    {loading ? <Loader2 className="animate-spin w-3 h-3" /> : <BrainCircuit className="w-3 h-3" />}
                    <span className="text-[9px] uppercase tracking-tighter">AI Refine</span>
                  </Button>
                </div>
                <Textarea name="description" value={item.description} placeholder="Describe the architecture and impact..." onChange={(e) => handleChange(index, e)} className="rounded-2xl border-slate-100 bg-white min-h-[120px] p-4 text-sm leading-relaxed whitespace-pre-wrap" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between gap-4">
        <Button variant="outline" onClick={addNewProject} className="h-12 rounded-2xl font-bold text-slate-600">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="h-12 rounded-2xl bg-slate-900 text-white px-10 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Projects;
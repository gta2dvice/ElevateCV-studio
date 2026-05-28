import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Sparkles, Save, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"; // Added to get resume ID
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI"; // Added for DB save
import { motion, AnimatePresence } from "framer-motion";

function Summary({ resumeInfo }) {
  const { resume_id } = useParams(); // Get ID from URL
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Separate loading state for the save button
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiSuggestions, setAiSuggestions] = useState([]); 
  const dispatch = useDispatch();

  // Keep local state synced with Redux if data loads late
  useEffect(() => {
    setSummary(resumeInfo?.summary || "");
  }, [resumeInfo?.summary]);

  const handleGenerateAI = async () => {
    if (!resumeInfo?.jobTitle) {
      return toast.error("Please add a Job Title in Personal Details first!");
    }
    
    setLoading(true);
    setAiSuggestions([]); 
    try {
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const baseUrl = rawUrl.replace(/\/+$/, ""); 
      
      const response = await axios.post(`${baseUrl}/api/ai/generate-content`, {
        context: `Generate 3 professional summaries for a ${resumeInfo.jobTitle}. Option 1: Results-oriented. Option 2: Skills-focused. Option 3: Leadership-driven. Format them clearly starting with "Option 1:", "Option 2:", and "Option 3:".`,
        promptType: 'summary'
      },
      { withCredentials: true });

      const aiContentString = response.data.data.content; 

      // Parse the single string into an array of 3 options
      let suggestionsArray = [];
      if (aiContentString) {
          suggestionsArray = aiContentString
            .split(/(?:Option \d:)/g)
            .map(str => str.trim())
            .filter(str => str.length > 0);
          
          if (suggestionsArray.length === 0) {
               suggestionsArray = [aiContentString];
          }
      }

      setAiSuggestions(suggestionsArray);
      toast.success("AI Variations generated!");
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = error?.response?.data?.message || "AI service is busy.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectSummary = (selectedText) => {
    setSummary(selectedText);
    
    // Auto-update Redux so preview updates instantly
    const updatedResume = { ...resumeInfo, summary: selectedText };
    dispatch(addResumeData(updatedResume));
    
    setAiSuggestions([]); 
    toast.info("Summary selected! Don't forget to click Save.");
  };

  const handleTextareaChange = (e) => {
    const newSummary = e.target.value;
    setSummary(newSummary);
    
    // Auto-update Redux so preview updates instantly
    dispatch(addResumeData({ ...resumeInfo, summary: newSummary }));
  };

  // --- THE NEW WORKING SAVE LOGIC ---
  const onSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Prepare the final object
      const updatedResume = { ...resumeInfo, summary: summary };
      
      // 2. Dispatch to Redux (just in case)
      dispatch(addResumeData(updatedResume));

      // 3. Fire the database API call
      const result = await updateThisResume(resume_id, updatedResume);
      
      if (result && (result.success || result.statusCode === 200)) {
        toast.success(result.message || "Summary synchronized with database!");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error?.message || "Failed to save summary.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl mt-6 md:mt-10 relative"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl shrink-0">
             <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h2 className="font-black text-lg md:text-2xl text-slate-900 uppercase tracking-tighter">
              Professional <span className="text-purple-600">Summary</span>
            </h2>
            <p className="hidden sm:block text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">
              Refine your professional narrative
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleGenerateAI}
          disabled={loading || isSaving}
          className="w-full lg:w-auto border-purple-100 text-purple-600 hover:bg-purple-50 flex gap-2 font-bold rounded-xl md:rounded-2xl h-10 md:h-11 px-6 transition-all shadow-sm text-[10px] md:text-xs uppercase"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
          {loading ? "Optimizing..." : "AI Assistant"}
        </Button>
      </div>

      <AnimatePresence>
        {aiSuggestions.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 md:mb-8 space-y-4 overflow-hidden"
          >
            <div className="p-1.5 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="grid grid-cols-1 gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    onClick={() => selectSummary(suggestion)}
                    className="p-4 md:p-5 bg-white rounded-[1.2rem] md:rounded-[1.5rem] border border-transparent hover:border-purple-200 hover:bg-purple-50/50 cursor-pointer transition-all group relative"
                  >
                    <div className="flex justify-between items-start gap-4">
                       <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                        {suggestion}
                      </p>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-slate-200 group-hover:text-purple-500 transition-colors shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSave} className="space-y-4 md:space-y-6">
        <Textarea 
          className="min-h-[140px] md:min-h-[160px] rounded-[1.2rem] md:rounded-[2rem] border-slate-100 bg-slate-50/50 p-4 md:p-6 text-slate-700 font-medium leading-relaxed focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all outline-none text-xs md:text-base whitespace-pre-wrap"
          required
          value={summary}
          onChange={handleTextareaChange}
          placeholder="Select an AI option or define your professional impact..."
        />

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full sm:w-auto bg-slate-900 hover:bg-purple-600 text-white rounded-xl md:rounded-2xl px-12 h-12 md:h-14 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving ? (
               <Loader2 className="animate-spin w-4 h-4" />
            ) : (
               <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export default Summary;
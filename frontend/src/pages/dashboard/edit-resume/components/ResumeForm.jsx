import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import { ArrowLeft, ArrowRight, HomeIcon, Sparkles, LoaderCircle, LayoutGrid, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ThemeColor from "./ThemeColor";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import TemplatePicker from "@/components/custom/TemplatePicker";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI"; 

function ResumeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resume_id } = useParams();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [showJdInput, setShowJdInput] = useState(false);
  
  // PERSISTENCE: Initialize state from Redux[cite: 7, 8]
  const [jobDescription, setJobDescription] = useState(resumeInfo?.jobDescription || "");
  const [analysisData, setAnalysisData] = useState(null);

  const getBaseUrl = () => import.meta.env.VITE_APP_URL || "http://localhost:5001";

  // HYDRATION: Sync local state when Redux loads[cite: 7, 8]
  useEffect(() => {
    if (resumeInfo?.jobDescription) {
      setJobDescription(resumeInfo.jobDescription);
    }
  }, [resumeInfo?.jobDescription]);

  // AUTO-SAVE: Debounced database sync for Job Description persistence[cite: 7]
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (jobDescription && jobDescription !== resumeInfo?.jobDescription) {
        try {
          await updateThisResume(resume_id, { ...resumeInfo, jobDescription });
        } catch (err) {
          console.error("Auto-save failed", err);
        }
      }
    }, 2000); // 2 second delay[cite: 7]

    return () => clearTimeout(delayDebounceFn);
  }, [jobDescription, resume_id, resumeInfo]);

  // 1. ATS ANALYSIS FUNCTION
  const runAnalysis = useCallback(async () => {
    if (!jobDescription) return toast.error("Please paste a Job Description first.");
    setIsAnalyzing(true);
    try {
      const response = await axios.post(`${getBaseUrl()}/api/ai/analyze-jd`, {
        resumeData: resumeInfo,
        jobDescription: jobDescription,
      }, { withCredentials: true });

      const score = response.data?.data?.matchPercentage;
      if (score !== undefined) {
        const updatedInfo = { ...resumeInfo, atsScore: score, jobDescription };
        
        // Sync to Redux and Database for permanence[cite: 7, 8]
        dispatch(addResumeData(updatedInfo));
        await updateThisResume(resume_id, updatedInfo);
        
        setAnalysisData(response.data.data);
        toast.success(`ATS Analysis Complete: ${score}% Match`);
      }
    } catch (error) {
      toast.error("AI Architect failed to analyze the JD.");
    } finally { setIsAnalyzing(false); }
  }, [jobDescription, resumeInfo, dispatch, resume_id]);

  // 2. FORGE VERSION FUNCTION
  const transformResumeWithAI = async () => {
    if (!jobDescription) return toast.error("Provide a JD to forge a version.");
    setIsRewriting(true);
    try {
      const response = await axios.post(`${getBaseUrl()}/api/ai/refine-json`, 
      {
        resumeData: resumeInfo,
        jobDescription: jobDescription 
      },
      { withCredentials: true });

      const forgedData = response.data?.data?.transformedData;

      if (forgedData) {
        const finalizedData = { ...forgedData, jobDescription };
        dispatch(addResumeData(finalizedData));
        
        // Persist forged content to DB
        await updateThisResume(resume_id, finalizedData);
        
        toast.success("Resume Forged! Content optimized for this role.");
        setAnalysisData(null); 
        setShowJdInput(false);
      }
    } catch (error) {
      toast.error("The Forge failed to rewrite your content.");
    } finally { setIsRewriting(false); }
  };

  // 3. REMOTE TRIGGER FROM HEADER
  useEffect(() => {
    const handleRemoteOptimize = () => {
      if (!jobDescription) {
        setShowJdInput(true);
        toast.info("Forge Suite: Paste your target job description to begin.");
      } else {
        runAnalysis();
      }
    };
    window.addEventListener('trigger-ai-optimization', handleRemoteOptimize);
    return () => window.removeEventListener('trigger-ai-optimization', handleRemoteOptimize);
  }, [jobDescription, runAnalysis]);

  const components = [
    { title: "Personal", component: <PersonalDetails resumeInfo={resumeInfo} enanbledNext={setEnabledNext} /> },
    { title: "Summary", component: <Summary resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} /> },
    { title: "Experience", component: <Experience resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} /> },
    { title: "Projects", component: <Project resumeInfo={resumeInfo} setEnabledNext={setEnabledNext} setEnabledPrev={setEnabledPrev} /> },
    { title: "Education", component: <Education resumeInfo={resumeInfo} enanbledNext={setEnabledNext} /> },
    { title: "Skills", component: <Skills resumeInfo={resumeInfo} enanbledNext={setEnabledNext} /> }
  ];

  const handleNextNavigation = () => {
    if (currentIndex < components.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate(`/dashboard/view-resume/${resume_id}/`);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[2rem] border border-slate-100 shadow-2xl">
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-11 w-full px-1">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="rounded-xl border-slate-100 h-11 w-11 shadow-sm"><HomeIcon className="w-4 h-4" /></Button>
          </Link>
          <TemplatePicker />
          <ThemeColor resumeInfo={resumeInfo} />
        </div>
        <div className="w-full">
          <Button
            variant="outline"
            onClick={() => setShowJdInput(!showJdInput)}
            className={`rounded-2xl w-full h-12 px-10 transition-all font-black uppercase text-[10px] tracking-widest flex gap-3 ${showJdInput ? 'bg-slate-900 text-white' : 'bg-purple-600 text-white shadow-xl shadow-purple-500/20'}`}
          >
            <Zap className="w-4 h-4" />
            {resumeInfo?.atsScore ? `Architect Grade: ${resumeInfo.atsScore}%` : "Forge ATS Version"}
          </Button>
        </div>
      </div>

      <div id="ai-forge-panel">
        <AnimatePresence>
          {showJdInput && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-10">
              <div className="p-8 bg-slate-900 rounded-[2.5rem] space-y-6">
                <Textarea
                  placeholder="Paste Job Description for ATS Forge..."
                  className="bg-slate-800 text-white placeholder:text-slate-500 border-none focus-visible:bg-slate-800"
                  value={jobDescription}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setJobDescription(newVal);
                    // REAL-TIME SYNC: Update Redux while typing[cite: 7, 8]
                    dispatch(addResumeData({ ...resumeInfo, jobDescription: newVal }));
                  }}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button disabled={isAnalyzing || !jobDescription} onClick={runAnalysis} className="bg-purple-600 hover:bg-purple-500 rounded-xl h-12 flex-1 font-bold text-xs">
                    {isAnalyzing ? <LoaderCircle className="animate-spin" /> : "Check Match"}
                  </Button>
                  <Button disabled={isRewriting || !jobDescription} onClick={transformResumeWithAI} className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-12 flex-1 font-black uppercase text-[10px] tracking-widest">
                    {isRewriting ? <LoaderCircle className="animate-spin w-4 h-4" /> : "Forge Version"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative min-h-[400px]">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Step {currentIndex + 1}: {components[currentIndex].title}</h2>
        </div>
        {components[currentIndex].component}
        
        <div className="flex justify-between mt-10">
           <Button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} variant="ghost">Back</Button>
           <Button onClick={handleNextNavigation}>{currentIndex === components.length - 1 ? "Deploy Studio" : "Proceed"}</Button>
        </div>
      </div>
    </div>
  );
}

export default ResumeForm;
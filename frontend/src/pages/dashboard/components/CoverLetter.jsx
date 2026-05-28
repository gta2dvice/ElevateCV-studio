import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Sparkles, Copy, Loader2, Save, Send, Upload, ChevronDown, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { getAllResumeData } from "@/Services/resumeAPI";

function CoverLetter({ resumeInfo: initialResumeInfo }) {
  const fileInputRef = useRef(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(initialResumeInfo || null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jd, setJd] = useState(initialResumeInfo?.jobDescription || "");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      setFetchingResumes(true);
      try {
        const result = await getAllResumeData();
        setResumes(result?.data || []);
      } catch (error) {
        toast.error("Failed to fetch internal resumes.");
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleSelectResume = (resume) => {
    setSelectedResume(resume);
    setUploadedFile(null); 
    if (resume?.jobDescription) {
      setJd(resume.jobDescription); // Auto-fill if exists
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setSelectedResume(null);
      setJd(""); // Reset JD to force fresh input for external files
      toast.success(`External Resume Loaded: ${file.name}`);
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const handleForgeLetter = async () => {
    if (!jd.trim()) {
      return toast.error("A Job Description is required to architect your letter.");
    }

    setLoading(true);
    try {
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const formData = new FormData();
      
      if (uploadedFile) {
        formData.append("resumeFile", uploadedFile);
        formData.append("jobDescription", jd);
      } else {
        formData.append("resumeInfo", JSON.stringify(selectedResume));
        formData.append("jobDescription", jd);
      }

      const response = await axios.post(`${rawUrl}/api/ai/generate-cover-letter`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      setLetter(response.data.data.content);
      toast.success("Cover letter forged!");
    } catch (error) {
      toast.error("The Forge failed to process the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 md:p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl mt-10"
    >
      {/* 1. HEADER & SOURCE SELECTION (MOVED TO START) */}
      <div className="flex flex-col gap-8 mb-10 border-b border-slate-50 pb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-100">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-900 uppercase tracking-tighter">
              Cover Letter <span className="text-purple-600">Architect</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Select your profile source</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Internal Resume Selector */}
          <div className="relative group flex-1 md:flex-none">
            <Button variant="outline" className="w-full md:w-auto rounded-xl border-slate-200 font-bold text-xs h-14 px-6 flex gap-3 shadow-sm hover:bg-slate-50 transition-all">
              <Upload className="w-4 h-4 text-purple-600" /> 
              {selectedResume ? selectedResume.title : "Pick a Forge Resume"}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
            <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl hidden group-hover:block z-50 max-h-60 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
              {resumes.map((res) => (
                <button key={res._id} onClick={() => handleSelectResume(res)} className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl text-xs font-bold text-slate-600 transition-all mb-1 flex items-center justify-between">
                  {res.title}
                  {selectedResume?._id === res._id && <div className="w-2 h-2 bg-purple-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* PDF Upload Option */}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current.click()}
            className={`flex-1 md:flex-none rounded-xl border-slate-200 font-bold text-xs h-14 px-6 flex gap-3 shadow-sm transition-all ${uploadedFile ? 'bg-purple-50 border-purple-200 text-purple-600' : 'hover:bg-slate-50'}`}
          >
            <FileUp className={`w-4 h-4 ${uploadedFile ? 'text-purple-600' : 'text-slate-400'}`} />
            {uploadedFile ? uploadedFile.name : "Upload External PDF"}
          </Button>
        </div>
      </div>

      {/* 2. INPUT & OUTPUT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Job Description</label>
              {uploadedFile && <span className="text-[9px] font-black text-purple-600 uppercase">PDF Context Active</span>}
            </div>
            <Textarea 
              placeholder="Paste the job requirements here to tailor your letter..."
              className="min-h-[350px] rounded-[2rem] bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-8 focus:ring-purple-600/5 transition-all p-6 text-sm leading-relaxed"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleForgeLetter}
            disabled={loading || (!selectedResume && !uploadedFile)}
            className="w-full h-16 bg-slate-900 hover:bg-purple-600 text-white rounded-[1.25rem] font-black uppercase text-xs tracking-[0.2em] flex gap-4 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-30"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Architecting Content..." : "Forge Cover Letter"}
          </Button>
        </div>

        {/* Output Area */}
        <div className="relative lg:pt-10">
          <AnimatePresence mode="wait">
            {letter ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col">
                <div className="flex-1 bg-slate-50/50 rounded-[2rem] p-8 md:p-10 border border-slate-100 text-slate-700 text-sm md:text-base whitespace-pre-wrap font-serif italic shadow-inner leading-relaxed">
                  {letter}
                </div>
                <div className="flex gap-4 mt-6">
                  <Button onClick={() => { navigator.clipboard.writeText(letter); toast.success("Copied!"); }} variant="outline" className="flex-1 h-14 rounded-xl border-slate-200 uppercase text-[10px] font-black tracking-widest hover:bg-slate-50">
                    <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
                  </Button>
                 
                </div>
              </motion.div>
            ) : (
              <div className="h-full border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center bg-slate-50/20">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  <Send className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Ready for Architecture</h4>
                <p className="text-slate-300 text-[10px] font-medium leading-relaxed max-w-[200px]">
                  Pick a source and paste the JD to generate your tailored letter.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default CoverLetter;
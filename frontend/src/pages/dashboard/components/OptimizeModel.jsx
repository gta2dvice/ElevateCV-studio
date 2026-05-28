import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CloudUpload, Loader2, Zap, FileText, Sparkles, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OptimizeModal({ open, setOpen }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [title, setTitle] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a PDF or DOCX file.");
    }
  };

  const handleOptimize = async () => {
    if (!file || !jd || !title) {
      return toast.error("Title, File, and Job Description are required!");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("title", title); 

    try {
      // ALIGNMENT FIX: Dynamic environment variable for production readiness
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const baseUrl = rawUrl.replace(/\/+$/, "");

      const response = await axios.post(`${baseUrl}/api/ai/transform-resume`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (response.data?.resumeId || response.data?.data?.resumeId) {
        const generatedId = response.data.resumeId || response.data.data.resumeId;
        toast.success("Studio Initialized!");
        setOpen(false);
        navigate(`/dashboard/edit-resume/${generatedId}`);
      }
    } catch (error) {
      console.error("FULL ERROR OBJECT:", error); 
      const backendError = error.response?.data?.details || error.response?.data?.error || error.response?.data?.message || "Initialization failed.";
      toast.error(backendError); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-100">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                AI Smart <span className="text-purple-600">Pivot</span>
              </DialogTitle>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                Initialize your professional transformation
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resume Title</label>
              <Input 
                placeholder="Ex: Senior MERN Developer - Google" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-600/20 font-bold"
              />
            </div>

            <div className="relative group">
              <input type="file" id="resume-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
              <label htmlFor="resume-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${file ? "bg-purple-50 border-purple-200" : "bg-slate-50 border-slate-100 hover:bg-white hover:border-purple-200"}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <><CheckCircle2 className="w-8 h-8 text-purple-600 mb-2" /><p className="text-xs font-bold text-slate-700">{file.name}</p></>
                  ) : (
                    <><CloudUpload className="w-8 h-8 text-slate-300 mb-2" /><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Drop Current Resume</p></>
                  )}
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Description</label>
              <Textarea
                placeholder="Paste the target JD here..."
                className="min-h-[120px] rounded-[1.5rem] border-none bg-slate-50 p-5 focus:bg-white transition-all text-sm"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <Button disabled={loading} onClick={handleOptimize} className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-purple-600 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Sparkles className="w-4 h-4 text-purple-400" />Initialize & Launch</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OptimizeModal;
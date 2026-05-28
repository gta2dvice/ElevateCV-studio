import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, Share2, PartyPopper, CheckCircle2, LoaderCircle } from "lucide-react";
import { RWebShare } from "react-web-share";

// Project-specific imports
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { addResumeData } from "@/features/resume/resumeFeatures";

function ViewResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isReadyForPDF, setIsReadyForPDF] = useState(false);

  const resumeInfo = useSelector((state) => state.editResume?.resumeData);

  useEffect(() => {
    if (resume_id) {
      fetchResumeInfo();
    }
  }, [resume_id]);

  const fetchResumeInfo = async () => {
    try {
      const response = await getResumeData(resume_id);
      const payload = response?.data?.data ? response.data.data : response?.data || response;
      
      dispatch(addResumeData(payload));
      setIsDataLoaded(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsReadyForPDF(true);
          if (typeof window !== 'undefined') {
            window.resumeReady = true; // Signal for pdfController.js[cite: 14]
            document.body.setAttribute('data-resume-status', 'ready');
            console.log("[Forge Studio] UI Handshake Complete.");
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load your professional profile");
    }
  };

  const getApiUrl = () => {
    try {
      const url = import.meta.env?.VITE_APP_URL || "http://localhost:5001";
      return url.replace(/\/+$/, "");
    } catch (e) {
      return "http://localhost:5001";
    }
  };

  const HandleDownload = async () => {
    if (!resume_id) return toast.error("Resume reference not found");
    setIsDownloading(true);
    const toastId = toast.loading("Forging your professional PDF...");

    try {
      const baseUrl = getApiUrl();
      const response = await axios({
        url: `${baseUrl}/api/resumes/download/${resume_id}`,
        method: 'GET',
        responseType: 'blob',
        withCredentials: true,
        headers: { 'Accept': 'application/pdf' }
      });

      const isPdf = response.data.type === 'application/pdf';
      if (!isPdf) throw new Error("Server returned an invalid format.");
      if (response.data.size < 15000) throw new Error("Incomplete document generated.");

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_${resume_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Success! Professional PDF Forged.", { id: toastId });
    } catch (error) {
      toast.error(error.message || "The Forge encountered a critical error.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 selection:bg-purple-100 font-sans">
      
      {/* 3. PRINT-SPECIFIC CSS RESET[cite: 15] */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 0 !important;
            size: auto;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          #noPrint {
            display: none !important;
          }
          #resume-preview {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
          }
        }
      `}} />

      <div id="noPrint" className="print:hidden">
        <div className="my-16 mx-10 md:mx-20 lg:mx-36 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-purple-100 shadow-sm">
            <PartyPopper className="text-purple-600 w-8 h-8" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Profile <span className="text-purple-600">Generated!</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
               <CheckCircle2 className={`w-4 h-4 ${isReadyForPDF ? 'text-emerald-500' : 'text-slate-300 animate-pulse'}`} />
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                 {isReadyForPDF ? "Ready for PDF Capture" : "Optimizing Visual Layout..."}
               </p>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button 
              onClick={HandleDownload} 
              disabled={isDownloading || !isReadyForPDF}
              className="bg-slate-900 hover:bg-purple-600 text-white px-10 h-14 rounded-2xl flex gap-3 font-black uppercase text-xs tracking-widest shadow-xl transition-all"
            >
              {isDownloading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? "Forging..." : "Download PDF"}
            </Button>
            
            <RWebShare data={{ text: "My professional resume", url: typeof window !== "undefined" ? window.location.href : "", title: "Professional Resume" }}>
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex gap-3 font-black uppercase text-xs tracking-widest px-10 shadow-sm">
                <Share2 className="w-4 h-4" /> Share Link
              </Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center px-4">
        <div 
          id="resume-preview" 
          className={`bg-white transition-opacity duration-700 rounded-sm overflow-hidden ${isReadyForPDF ? 'opacity-100' : 'opacity-0'}`}
         style={{ 
        width: "210mm", 
        minHeight: "297mm",
        backgroundColor: "white",
        margin: "0 auto", // Changed: Remove top/bottom margins[cite: 13, 14]
        padding: "0",
        position: "relative",
        top: "0" // Force it to the top[cite: 13, 14]
      }}
        >
          {isDataLoaded && <ResumePreview />}
        </div>
      </motion.div>
    </div>
  );
}

export default ViewResume;
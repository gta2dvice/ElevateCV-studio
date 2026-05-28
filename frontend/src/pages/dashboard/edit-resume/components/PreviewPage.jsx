import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import { motion } from 'framer-motion';
import { Sparkles, Printer, Target } from 'lucide-react';

function PreviewPage() {
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const selectedTemplate = resumeInfo?.templateId || 'modern'; 

  // --- FUNCTIONAL ATS LOGIC ---
  // We use a memoized score. In a full implementation, this could come from 
  // your Redux store after the AI AnalyzeJD call.
  const atsScore = useMemo(() => {
    return resumeInfo?.atsScore || 0; // Defaults to 0 if not yet analyzed
  }, [resumeInfo?.atsScore]);
  // Calculation for the SVG radial progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;
  // Add this inside PreviewPage to signal your backend controller
useEffect(() => {
  if (resumeInfo) {
    // Small delay to ensure Framer Motion animations complete
    const timer = setTimeout(() => {
      window.resumeReady = true;
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [resumeInfo]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 md:p-10 flex flex-col items-center selection:bg-purple-100">
      
      {/* 1. FUNCTIONAL AI STATUS BADGE (Non-Printing) */}
      <div id="noPrint" className="fixed top-50 right-8 z-50 hidden xl:block">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center gap-4"
        >
          <div className="relative flex items-center justify-center">
            {/* Dynamic Radial Progress */}
            <svg className="w-20 h-20 transform -rotate-90">
              <circle 
                cx="40" cy="40" r={radius} 
                stroke="currentColor" strokeWidth="5" 
                fill="transparent" className="text-slate-50" 
              />
              <motion.circle 
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="40" cy="40" r={radius} 
                stroke="currentColor" strokeWidth="5" 
                fill="transparent" 
                strokeDasharray={circumference}
                className="text-purple-600" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-black text-lg text-slate-900 leading-none">{atsScore}%</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Match Grade</p>
            <div className={`flex items-center gap-1 mt-1 justify-center ${atsScore > 70 ? 'text-emerald-500' : 'text-purple-600'}`}>
              {atsScore > 70 ? <Target className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              <span className="text-[9px] font-black uppercase tracking-widest">
                {atsScore > 70 ? 'High Compatibility' : 'AI Optimized'}
              </span>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-slate-100 my-1" />
          
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
          >
            <Printer className="w-4 h-4" /> Quick Print
          </button>
        </motion.div>
      </div>

      {/* 2. THE RESUME CANVAS (A4 Studio View) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        id="pdf-content"
        className="w-full max-w-[210mm] bg-white shadow-[0_60px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 origin-top mb-20 rounded-sm overflow-hidden"
        style={{ minHeight: '297mm' }}
      >
        <div className="preview-container h-full">
          {selectedTemplate === 'professional' ? (
            <ProfessionalTemplate resumeInfo={resumeInfo} />
          ) : (
            <ModernTemplate resumeInfo={resumeInfo} />
          )}
        </div>
      </motion.div>

      {/* 3. MOBILE EXPORT CTA */}
      <div id="noPrint" className="fixed bottom-8 left-1/2 -translate-x-1/2 xl:hidden z-50">
         <button 
           onClick={() => window.print()}
           className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 hover:bg-purple-600 transition-all"
         >
           <Printer className="w-4 h-4" /> Export PDF
         </button>
      </div>
    </div>
  );
}

export default PreviewPage;
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle, User, MapPin, Phone, Mail, Briefcase, Save } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion } from "framer-motion";

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false); // Used explicit isSaving state

  // --- LIVE SYNC LOGIC ---
  const handleInputChange = (e) => {
    if (enanbledNext) enanbledNext(false); 
    const { name, value } = e.target;
    
    // Immediate dispatch ensures the Live Preview reflects changes instantly
    dispatch(
      addResumeData({
        ...resumeInfo,
        [name]: value,
      })
    );
  };

  const onSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateThisResume(resume_id, resumeInfo);

      if (result && (result.success || result.statusCode === 200)) {
        toast.success(result.message || "Professional identity synchronized!");
        if (enanbledNext) enanbledNext(true);
      }
    } catch (error) {
      console.error("Sync Error:", error);
      toast.error(error?.message || "Sync failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-10 bg-white shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 mt-6 md:mt-10 relative overflow-hidden"
    >
      {/* Visual Identity Header */}
      <div className="mb-8 md:mb-10 relative z-10 flex items-center gap-4">
        <div className="p-2.5 bg-purple-600 rounded-xl md:rounded-2xl shadow-lg shadow-purple-100 shrink-0">
          <User className="text-white w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div>
          <h2 className="font-black text-lg md:text-2xl text-slate-900 uppercase tracking-tighter leading-none">
            Personal <span className="text-purple-600">Identity</span>
          </h2>
          <p className="hidden sm:block text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">
            Establish your professional foundation
          </p>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-4 md:space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">First Name</label>
            <Input
              name="firstName"
              placeholder="Ex: Jane"
              defaultValue={resumeInfo?.firstName}
              required
              onChange={handleInputChange}
              className="h-10 md:h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-bold text-xs md:text-base text-slate-700"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Last Name</label>
            <Input
              name="lastName"
              placeholder="Ex: Doe"
              defaultValue={resumeInfo?.lastName}
              required
              onChange={handleInputChange}
              className="h-10 md:h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-bold text-xs md:text-base text-slate-700"
            />
          </div>

          {/* Job Title */}
          <div className="col-span-full space-y-2">
            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
              <Briefcase className="w-3 h-3 text-purple-600" /> Professional Title
            </label>
            <Input
              name="jobTitle"
              placeholder="Ex: Product Manager or Software Engineer"
              defaultValue={resumeInfo?.jobTitle}
              onChange={handleInputChange}
              className="h-10 md:h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-bold text-xs md:text-base text-slate-700"
            />
          </div>

          {/* Address */}
          <div className="col-span-full space-y-2">
            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-purple-600" /> Professional Location
            </label>
            <Input
              name="address"
              placeholder="Ex: Mumbai, India or Remote"
              defaultValue={resumeInfo?.address}
              required
              onChange={handleInputChange}
              className="h-10 md:h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-semibold text-xs md:text-sm"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
              <Phone className="w-3 h-3 text-purple-600" /> Contact Number
            </label>
            <Input
              name="phone"
              type="tel"
              placeholder="+91 00000 00000"
              defaultValue={resumeInfo?.phone}
              required
              onChange={handleInputChange}
              className="h-10 md:h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-semibold text-xs md:text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3 text-purple-600" /> Business Email
            </label>
            <Input
              name="email"
              type="email"
              placeholder="jane.doe@careerhub.com"
              defaultValue={resumeInfo?.email}
              required
              onChange={handleInputChange}
              className="h-10 md:h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 md:focus:ring-8 focus:ring-purple-600/5 transition-all font-semibold text-xs md:text-sm"
            />
          </div>
        </div>

        {/* FOOTER: Responsive Layout */}
        <div className="flex flex-col sm:flex-row justify-end pt-6 md:pt-8 border-t border-slate-50 gap-4">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full sm:w-auto bg-slate-900 text-white hover:bg-purple-600 rounded-xl md:rounded-[1.25rem] px-10 md:px-12 h-12 md:h-14 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving ? <LoaderCircle className="animate-spin w-5 h-5" /> : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export default PersonalDetails;
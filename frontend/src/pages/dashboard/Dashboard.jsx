import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; 
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import OptimizeModal from "./components/OptimizeModel";
import PricingTable from "./components/PricingTable"; 
import { 
  Crown, LayoutGrid, ShieldCheck, 
  FolderKanban, Sparkles, FileText, Rocket, FileUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = useState([]);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  const fetchAllResumeData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllResumeData();
      const extractedData = response?.data || [];
      setResumeList(Array.isArray(extractedData) ? extractedData : []);
    } catch (error) {
      toast.error("Failed to sync your repository.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAllResumeData();
  }, [user]);

  const isPro = user?.subscriptionStatus === "pro";
  const aiCredits = user?.aiCredits ?? 0;

  const avgAtsScore = useMemo(() => {
    if (!resumeList.length) return "0%";
    const total = resumeList.reduce((acc, curr) => acc + (curr.atsScore || 0), 0);
    return `${Math.round(total / resumeList.length)}%`;
  }, [resumeList]);

  const handleUpgrade = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/payments/create-checkout`, {}, { withCredentials: true });
      if (response.data?.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      toast.error("Billing portal is temporarily unavailable.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 selection:bg-cyan-100 md:p-10 lg:px-20">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-14 flex flex-col justify-between gap-8 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm md:p-10 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2 shadow-xl shadow-slate-200">
               <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white"> Active</span>
            </div>
          </div>
          <h2 className="mb-3 text-4xl font-black leading-[0.9] tracking-tight text-slate-900 md:text-6xl">
            Career Command <span className="text-cyan-600">Center</span>
          </h2>
          <p className="max-w-xl text-sm font-medium text-slate-500 md:text-base">
            Manage resume versions, boost ATS performance, and generate role-specific documents from one workspace.
          </p>
        </div>

        <motion.div 
          whileHover={{ y: -2 }}
          onClick={!isPro ? handleUpgrade : null}
          className={`group flex cursor-pointer items-center gap-4 rounded-3xl border-2 px-6 py-4 transition-all ${
            isPro ? "border-slate-800 bg-slate-900 text-white shadow-2xl" : "border-slate-100 bg-white text-slate-600 shadow-sm hover:border-cyan-200"
          }`}
        >
          <div className={`rounded-2xl p-3 ${isPro ? "bg-cyan-600" : "bg-slate-50"}`}>
            {isPro ? <Crown className="h-5 w-5 text-white" /> : <Rocket className="h-5 w-5 text-cyan-600" />}
          </div>
          <div className="flex min-w-[120px] flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5">
              {isPro ? "Growth Tier" : "Limited Access"}
            </span>
            <span className="text-xs font-black uppercase tracking-[0.1em]">
              {isPro ? "Pro Member" : `${aiCredits} Credits`}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Active Profiles", value: isLoading ? "..." : resumeList.length, icon: <LayoutGrid />, color: "text-blue-600" },
          { label: "AI Smart Credits", value: isPro ? "∞" : aiCredits, icon: <Sparkles />, color: "text-purple-600" },
          { label: "Average Readiness", value: isLoading ? "..." : avgAtsScore, icon: <ShieldCheck />, color: "text-emerald-600" }
        ].map((stat, i) => (
          <motion.div key={i} className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-cyan-500/30">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 transition-colors group-hover:text-cyan-600">{stat.label}</p>
                <h3 className={`text-5xl font-black tracking-tighter ${stat.color} leading-none`}>{stat.value}</h3>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 text-slate-400 transition-all group-hover:text-cyan-600">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
        <AddResume /> 

        <Button 
          onClick={() => setShowOptimizeModal(true)}
          className="group flex h-20 gap-3 rounded-2xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-cyan-600 active:scale-95 sm:h-28 sm:px-8"
        >
          <FileUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
          Optimize Existing
        </Button>

        <Link to="/dashboard/cover-letter" className="flex-1">
          <Button 
            className="group flex h-20 w-full gap-3 rounded-2xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-cyan-600 active:scale-95 sm:h-28 sm:px-8"
          >
            <FileText className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Build Cover Letter
          </Button>
        </Link>
      </div>

      <div className="relative">
        <div className="mb-10 flex items-center gap-4">
           <FolderKanban className="h-5 w-5 text-slate-300" />
           <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Your Resume Library</h3>
           <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resumeList.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} refreshData={fetchAllResumeData} />
          ))}
        </div>
      </div>

      {!isPro && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-24">
          <PricingTable user={user} />
        </motion.div>
      )}

      <OptimizeModal open={showOptimizeModal} setOpen={setShowOptimizeModal} />
    </div>
  );
}

export default Dashboard;
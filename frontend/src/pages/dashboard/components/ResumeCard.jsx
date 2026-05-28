import React, { useMemo } from "react";
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Loader2, 
  Briefcase, 
  Target, 
  Sparkles
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const gradients = [
  "from-slate-900 to-slate-800", 
  "from-purple-600 to-indigo-600",
  "from-purple-700 to-purple-500",
];

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const navigate = useNavigate();

  // Memoizing the gradient for brand consistency
  const gradient = useMemo(() => gradients[Math.floor(Math.random() * gradients.length)], []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteThisResume(resume._id);
      toast.success("Profile removed successfully");
      refreshData();
    } catch (error) {
      toast.error("Failed to remove profile");
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative h-full"
    >
      <div className={`p-[1px] rounded-[2.5rem] bg-gradient-to-br ${gradient} shadow-xl shadow-slate-200/50`}>
        <div className="bg-white rounded-[2.4rem] h-full flex flex-col justify-between overflow-hidden">
          
          {/* Header Section */}
          <div className={`p-8 bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}>
            {/* Subtle Glassmorphism Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                <Target className="w-3 h-3 text-purple-200" />
                <span>Score: 85</span>
              </div>
            </div>

            <h2 className="font-black text-xl line-clamp-1 uppercase tracking-tighter mb-1 relative z-10">
              {resume.title}
            </h2>
            <div className="flex items-center gap-1 relative z-10">
              <Sparkles className="w-3 h-3 text-purple-300" />
              <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em]">
                Professional Profile
              </p>
            </div>
          </div>

          {/* Action Menu */}
          <div className="flex items-center justify-between p-6 bg-white">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
                className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-all shadow-sm"
              >
                <Eye className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
                className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-all shadow-sm"
              >
                <Edit3 className="w-5 h-5" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenAlert(true)}
              className="w-11 h-11 rounded-2xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Confirmation Dialog - Styled for Universal Users */}
          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent className="rounded-[2.5rem] border-none p-10 bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black tracking-tighter uppercase text-slate-900">
                  Remove <span className="text-red-500">Profile?</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
                  This will permanently delete this professional profile from your account. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 gap-3">
                <AlertDialogCancel className="rounded-2xl h-12 px-8 font-bold bg-slate-50 border-none text-slate-500 hover:bg-slate-100 transition-all">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl h-12 px-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-100 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete Profile"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}

export default ResumeCard;
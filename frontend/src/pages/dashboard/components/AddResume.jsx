import React, { useState } from "react";
import { Plus, Loader2, Sparkles, Wand2, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createResume = async () => {
    if (!resumetitle.trim()) return;
    setLoading(true);

    // ALIGNMENT FIX: Send the flat object to match your Mongoose Schema
    const payload = {
      title: resumetitle,
    };

    try {
      const res = await createNewResume(payload);
      
      // ALIGNMENT FIX: Hardened response extractor to handle ApiResponse structure
      const responseData = res?.data?.data ? res.data.data : res?.data || res;
      
      if (responseData?._id) {
        navigate(`/dashboard/edit-resume/${responseData._id}`);
      }
    } catch (error) {
      console.error("Profile creation failed:", error.message);
    } finally {
      setLoading(false);
      setResumetitle("");
      setOpenDialog(false);
    }
  };

  return (
    <>
      {/* 1. RESPONSIVE PREMIUM BUTTON */}
      <Button 
        onClick={() => setOpenDialog(true)}
        className="group flex h-20 w-full gap-3 rounded-2xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-cyan-600 active:scale-95 sm:h-28 sm:w-auto sm:px-8"
      >
        <PlusCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
        Create New Resume
      </Button>

      {/* 2. RESPONSIVE CREATION DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setOpenDialog}>
        <DialogContent className="w-[95vw] max-w-[425px] rounded-[2rem] border-none bg-white p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="shrink-0 rounded-xl bg-cyan-600 p-2">
                <Wand2 className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none pt-1">
                New <span className="text-cyan-600">Resume</span>
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 font-medium text-[10px] sm:text-xs uppercase tracking-widest leading-relaxed">
              Name the role you are preparing this resume for.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 sm:py-8">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-3 block">
              Resume Title / Role Name
            </label>
            <Input
              id="title"
              placeholder="Ex: Senior Full Stack Developer"
              className="h-12 rounded-2xl border-none bg-slate-50 font-bold text-slate-700 transition-all focus:bg-white focus:ring-8 focus:ring-cyan-600/10 sm:h-14"
              value={resumetitle}
              onChange={(e) => setResumetitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={createResume} 
              disabled={!resumetitle.trim() || loading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-cyan-600 sm:h-14"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  Initialize Studio
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full rounded-2xl h-10 sm:h-12 font-bold text-slate-400 hover:text-slate-600 text-[10px] uppercase tracking-widest"
              onClick={() => setOpenDialog(false)}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
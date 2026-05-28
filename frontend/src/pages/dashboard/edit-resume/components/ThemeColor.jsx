import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Check, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  
  // Professional palette curated for executive & universal appeal
  const colors = [
    "#1e293b", "#0f172a", "#4f46e5", "#7c3aed", "#2563eb",
    "#0891b2", "#059669", "#16a34a", "#ca8a04", "#d97706",
    "#ea580c", "#dc2626", "#be123c", "#db2777", "#9333ea",
    "#4b5563", "#334155", "#06b6d4", "#3b82f6", "#000000"
  ];

  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor);

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    
    // UI (UX): Immediate Redux dispatch for zero-latency Live Preview
    const updatedResume = {
      ...resumeInfo,
      themeColor: color,
    };
    dispatch(addResumeData(updatedResume));

    // ALIGNMENT FIX: Send the flat object to match the updated Mongoose schema
    try {
      const result = await updateThisResume(resume_id, updatedResume);
      
      if (result && (result.success || result.statusCode === 200)) {
         toast.success("Professional Style Updated");
      }
    } catch (error) {
      toast.error("Failed to sync your preferences");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-2xl border-slate-100 bg-white h-11 px-5 gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <Palette className="w-4 h-4 text-purple-600" />
          <span className="text-xs uppercase tracking-widest">Visual Style</span>
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-md ring-1 ring-slate-100" 
            style={{ backgroundColor: selectedColor || resumeInfo?.themeColor || "#1e293b" }} 
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-6 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none bg-white/95 backdrop-blur-xl">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Personal Brand Color
            </h2>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {colors.map((item, index) => (
              <div
                key={index}
                onClick={() => onColorSelect(item)}
                className={`h-9 w-9 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-sm relative group
                  ${(selectedColor === item || resumeInfo?.themeColor === item) 
                    ? "ring-2 ring-purple-600 ring-offset-2" 
                    : "hover:ring-2 hover:ring-slate-100 hover:ring-offset-2"
                  }
                `}
                style={{ backgroundColor: item }}
              >
                {(selectedColor === item || resumeInfo?.themeColor === item) && (
                  <Check className="w-4 h-4 text-white drop-shadow-sm" />
                )}
                <div className="absolute -top-8 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold uppercase tracking-tighter">
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-50">
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
              * Select a color that resonates with your industry standard.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
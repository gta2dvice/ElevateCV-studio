import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { LoaderCircle, Wand2 } from "lucide-react";
import axios from "axios"; // ALIGNMENT: Swapped SDK for API call

function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  // ALIGNMENT: Updated variable name to match Redux state mapping
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    const project = resumeInfo?.projects[index];
    
    // ALIGNMENT: Updated variable names to match Redux mapping
    if (!project?.projectName || !project?.techStack) {
      toast.error("Please add a Project Name and key Tools first!");
      return;
    }
    
    setLoading(true);
    try {
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const baseUrl = rawUrl.replace(/\/+$/, ""); 

      // ALIGNMENT: Route request through the backend
      const response = await axios.post(`${baseUrl}/api/ai/generate-content`, {
        context: `Create 3 high-impact professional achievement bullet points describing a project named ${project.projectName} using these tools: ${project.techStack}. Focus on measurable results. Do not use asterisks. Separate each point with a new line.`,
        promptType: 'experience' 
      }, { withCredentials: true });

      let aiResult = response.data?.data?.content || response.data?.content;

      // ALIGNMENT FIX: Clean and format markdown text to prevent textarea flattening
      if (typeof aiResult === "string") {
        let cleanText = aiResult.replace(/\*\*/g, ""); 
        const bulletArray = cleanText
            .split(/\n|\* | - /)
            .map(line => line.trim())
            .filter(line => line.length > 5);
            
        aiResult = bulletArray.map(line => `• ${line}`).join("\n\n");
      }

      setValue(aiResult);
      toast.success("AI has polished your project achievements!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "AI service is busy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-3 px-1">
        <div>
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
            Project Impact & Description
          </label>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="w-full sm:w-auto h-9 px-4 rounded-xl border-purple-100 text-purple-600 font-bold hover:bg-purple-50 flex gap-2 transition-all active:scale-95 shadow-sm"
        >
          {loading ? (
            <LoaderCircle className="animate-spin w-3 h-3" />
          ) : (
            <>
              <Wand2 className="h-3 w-3" /> 
              <span className="text-[10px] uppercase tracking-wider">Refine with AI</span>
            </>
          )}
        </Button>
      </div>

      <div className="rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50/30 focus-within:border-purple-200 focus-within:ring-4 sm:focus-within:ring-8 focus-within:ring-purple-600/5 transition-all">
        <EditorProvider>
          <Editor
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className="min-h-[140px] sm:min-h-[150px] bg-transparent p-3 sm:p-4 outline-none text-sm sm:text-base leading-relaxed whitespace-pre-wrap"
          >
            <Toolbar className="bg-white border-b border-slate-100 p-1.5 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1">
              <BtnBold className="scale-90 sm:scale-100" />
              <BtnItalic className="scale-90 sm:scale-100" />
              <BtnUnderline className="scale-90 sm:scale-100" />
              <BtnStrikeThrough className="scale-90 sm:scale-100" />
              <Separator className="mx-0.5 sm:mx-1 border-slate-100" />
              <BtnNumberedList className="scale-90 sm:scale-100" />
              <BtnBulletList className="scale-90 sm:scale-100" />
              <Separator className="mx-0.5 sm:mx-1 border-slate-100" />
              <BtnLink className="scale-90 sm:scale-100" />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </div>
      
      <p className="mt-2 text-[8px] sm:text-[9px] text-slate-400 font-medium px-2 uppercase tracking-tight">
        Pro-tip: Use the AI button to turn simple tasks into high-impact achievements.
      </p>
    </div>
  );
}

export default SimpeRichTextEditor;
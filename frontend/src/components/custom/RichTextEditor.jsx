import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
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

export default function RichTextEditor({ defaultValue, onRichTextEditorChange, index, title }) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const GenerateSummeryFromAI = async () => {
    if (!title) {
      toast.error('Please enter a Job Title first so AI can help!');
      return;
    }
    setLoading(true);

    try {
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const baseUrl = rawUrl.replace(/\/+$/, ""); 
      
      const response = await axios.post(`${baseUrl}/api/ai/generate-content`, {
        context: `Provide 3 professional achievement bullet points for a ${title} role. Do not use asterisks. Separate each point with a new line.`,
        promptType: 'experience' 
      }, { withCredentials: true }); // ALIGNMENT: Added withCredentials

      // ALIGNMENT FIX: Handle the ApiResponse wrapper
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
      onRichTextEditorChange(aiResult);
      
      toast.success("AI has polished your professional achievements!");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "AI service is busy.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-3">
        <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Achievements & Impact
        </label>
        <Button
          variant="outline"
          type="button"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="w-full sm:w-auto h-9 sm:h-8 rounded-xl border-purple-100 text-purple-600 font-bold hover:bg-purple-50 flex gap-2 transition-all active:scale-95 shadow-sm px-4"
        >
          {loading ? (
            <Loader2 className="animate-spin w-3 h-3" />
          ) : (
            <>
              <Wand2 className="h-3 w-3" /> 
              <span className="text-[9px] sm:text-[10px] uppercase">Refine with AI</span>
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
              onRichTextEditorChange(e.target.value);
            }}
            className="min-h-[140px] sm:min-h-[160px] bg-transparent p-3 sm:p-4 outline-none leading-relaxed text-sm sm:text-base whitespace-pre-wrap"
          >
            <Toolbar className="bg-white border-b border-slate-100 p-1 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1">
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
    </div>
  );
}
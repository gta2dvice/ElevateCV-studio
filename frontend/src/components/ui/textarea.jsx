import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-2xl border-none px-4 py-4 text-sm font-medium ring-offset-background leading-relaxed transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        
        // DEFAULT THEME: Slate for light areas, but allows override for dark areas
        "bg-slate-50/50 text-slate-800 placeholder:text-slate-400",
        
        // FIXED FOCUS: Removed 'focus-visible:bg-white' to prevent the white-out effect[cite: 15]
        "focus-visible:ring-8 focus-visible:ring-purple-600/5",
        
        className // This allows ResumeForm.jsx to override colors[cite: 15]
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
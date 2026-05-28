import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        // Updated: h-12 for better touch/click targets, rounded-2xl for brand consistency
        "flex h-12 w-full rounded-2xl border-none bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 transition-all focus-visible:outline-none focus-visible:bg-white focus-visible:ring-8 focus-visible:ring-purple-600/5 focus-visible:border-purple-600/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
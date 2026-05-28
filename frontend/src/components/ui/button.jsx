import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/20 disabled:pointer-events-none disabled:opacity-50 active:scale-95 uppercase tracking-widest",
  {
    variants: {
      variant: {
        // Updated: The signature CareerForge primary style
        default: "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-purple-600 hover:shadow-purple-200 transition-all duration-300",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-100",
        // Updated: Premium ghost-style outline
        outline:
          "border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
        secondary:
          "bg-purple-50 text-purple-600 hover:bg-purple-100 shadow-none",
        ghost: "text-slate-400 hover:bg-slate-50 hover:text-slate-900",
        link: "text-purple-600 underline-offset-4 hover:underline",
      },
      size: {
        // Updated: Increased heights and rounding to [1.25rem]
        default: "h-12 px-8 rounded-2xl",
        sm: "h-10 px-4 rounded-xl text-xs",
        lg: "h-14 px-12 rounded-[1.5rem] text-base",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
import React from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster({ ...props }) {
  return (
    <Sonner
      position="top-right"
      expand={true}
      richColors
      gap={12}
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: `
            group relative flex items-center gap-3
            rounded-2xl px-5 py-4
            bg-white/80 backdrop-blur-xl
            border border-slate-100
            shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            transition-all duration-300 ease-out
            data-[visible=true]:animate-in
            data-[visible=true]:slide-in-from-top-5
            data-[visible=false]:animate-out
            data-[visible=false]:fade-out
          `,
          title: "font-bold text-sm text-slate-900 tracking-tight",
          description: "text-xs text-slate-500 font-medium",
          actionButton: `
            bg-purple-600 text-white text-xs font-bold
            rounded-xl px-3 py-1.5
            hover:bg-purple-700 transition
          `,
          cancelButton: `
            bg-slate-100 text-slate-600 text-xs font-bold
            rounded-xl px-3 py-1.5
          `,
          success: "text-purple-600",
          error: "text-red-500",
        },
      }}
      {...props}
    />
  );
}
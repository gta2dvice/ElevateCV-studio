import React from 'react';
import { motion } from "framer-motion";
import {
  WandSparkles,
  LayoutTemplate,
  Target,
  FileCheck,
  GaugeCircle
} from "lucide-react"

const features = [
  {
    title: "AI Rewrite Studio",
    desc: "Turn plain job descriptions into impact-first bullets crafted for recruiters and ATS systems.",
    className: "md:col-span-2 bg-gradient-to-br from-cyan-600 to-blue-700 text-white border border-white/20",
    textClassName: "text-white",
    iconWrapClassName: "border border-white/10 bg-white/10",
    icon: <WandSparkles className="h-9 w-9 text-cyan-100" />,
    accent: <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/20 blur-[100px]" />
  },
  {
    title: "ATS Compliance Check",
    desc: "Get instant readability and keyword feedback before you hit apply.",
    className: "bg-white border border-cyan-100 shadow-sm",
    textClassName: "text-slate-900",
    iconWrapClassName: "border border-slate-200 bg-slate-50",
    icon: <GaugeCircle className="h-8 w-8 text-cyan-600" />
  },
  {
    title: "Template Playbook",
    desc: "Switch modern layouts in one click and keep content perfectly aligned.",
    className: "bg-white border border-blue-100 shadow-sm",
    textClassName: "text-slate-900",
    iconWrapClassName: "border border-slate-200 bg-slate-50",
    icon: <LayoutTemplate className="h-8 w-8 text-blue-600" />
  },
  {
    title: "Targeted Storytelling",
    desc: "Match language to each role and present your achievements with confidence.",
    className: "md:col-span-2 bg-slate-900 border border-slate-800 text-white",
    textClassName: "text-white",
    iconWrapClassName: "border border-white/10 bg-white/10",
    icon: <Target className="h-8 w-8 text-cyan-300" />
  },
  {
    title: "Export-Ready Files",
    desc: "Download recruiter-ready PDFs that preserve structure and visual hierarchy.",
    className: "bg-white border border-slate-200 shadow-sm",
    textClassName: "text-slate-900",
    iconWrapClassName: "border border-slate-200 bg-slate-50",
    icon: <FileCheck className="h-8 w-8 text-emerald-600" />
  }
];

export function Features() {
  return (
    <section id="templates" className="bg-white py-24 scroll-mt-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-cyan-600">
            Platform Highlights
          </h2>
          <h3 className="text-4xl font-black leading-none tracking-tight text-slate-900 md:text-5xl">
            Built to Move You from Draft to Offer
          </h3>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl p-8 ${f.className}`}
            >
              {f.accent}
              
              <div className={`relative z-10 ${f.textClassName}`}>
                <div className={`mb-5 w-fit rounded-2xl p-3 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 ${f.iconWrapClassName}`}>
                  {f.icon}
                </div>
                <h3 className="mb-3 text-2xl font-black leading-none tracking-tight">
                  {f.title}
                </h3>
                <p className="max-w-[320px] text-sm font-medium leading-relaxed opacity-90">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}